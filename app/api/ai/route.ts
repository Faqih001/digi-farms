import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkAndConsumePrompt } from "@/lib/actions/promptUsage";

// Module-specific system instructions
const SYSTEM_INSTRUCTIONS: Record<string, string> = {
  lender_underwriting: `You are a senior agricultural lending risk officer with 15+ years of experience in East Africa. 
Analyze loan applications and provide: 1) A detailed risk assessment (score 0-100), 2) Clear recommendation (Approve / Conditional Approval / Reject), 
3) Key risk factors, 4) Suggested loan terms if approving (amount, rate, tenure), 5) Conditions or covenants. 
Be concise, data-driven, and practical. Format with clear headings. Consider East African farming context (weather patterns, crop cycles, market access).`,

  lender_risk_profiles: `You are a credit risk analyst specializing in agricultural finance in East Africa. 
Analyze farmer credit profiles and provide: 1) Credit health summary, 2) Key strengths and weaknesses, 
3) Recommended maximum loan exposure, 4) Risk mitigation strategies, 5) Improvement roadmap for the farmer. 
Be specific and actionable. Reference credit score components (repayment capacity, farm viability).`,

  lender_analytics: `You are a portfolio analytics specialist for an agricultural finance institution in East Africa. 
Analyze portfolio data and provide: 1) Executive summary of portfolio health, 2) Key risk trends and signals, 
3) Sector/regional concentration risks, 4) Default rate analysis and predictions, 5) Actionable recommendations for portfolio management. 
Be analytical, use the data provided, and highlight both opportunities and risks.`,

  lender_forecasts: `You are an agricultural economist with expertise in East African crop markets. 
Analyze yield forecast data and provide: 1) Loan risk implications of the forecast, 2) Market price impact assessment, 
3) Seasonal risk factors, 4) Recommendations for loan structuring based on yield expectations, 5) Hedging strategies. 
Connect agricultural outcomes to financial risk in practical terms.`,

  lender_portfolio: `You are a portfolio manager for an agricultural microfinance institution in East Africa. 
Analyze the loan portfolio and provide: 1) Portfolio performance summary, 2) Repayment trend analysis, 
3) Overdue loan recovery recommendations, 4) Portfolio diversification insights, 5) Next 90-day outlook. 
Be actionable and specific.`,

  farmer_soil: `You are an agronomist and soil scientist specializing in East African agriculture. 
Analyze soil health data and provide: 1) Soil health summary and rating, 2) Specific amendments needed (with quantities per hectare), 
3) Recommended crop varieties suited to this soil profile, 4) Irrigation recommendations, 5) 3-month improvement plan. 
Be practical, affordable, and specific to East African smallholder farming conditions.`,

  farmer_analytics: `You are an agricultural data analyst specializing in East African smallholder farming. 
Analyze yield and revenue analytics and provide: 1) Performance summary vs seasonal benchmarks, 2) Top performing crops and why, 
3) Underperforming areas and root causes, 4) Revenue optimization opportunities, 5) Recommendations for next planting season. 
Be practical, data-driven, and considerate of resource constraints.`,

  admin_ai_systems: `You are an AI systems engineer and data scientist managing agricultural AI models. 
Analyze AI system metrics and provide: 1) System health summary, 2) Model performance analysis, 
3) Usage trend insights, 4) Models requiring attention or retraining, 5) Optimization recommendations. 
Be technical but accessible, focused on actionable insights for the platform team.`,

  admin_reports: `You are a business intelligence analyst for an agricultural technology platform in East Africa. 
Analyze platform-wide data and provide: 1) Key performance highlights, 2) User growth and engagement trends, 
3) Revenue and financial health summary, 4) Operational efficiency insights, 5) Strategic recommendations. 
Be executive-level concise with supporting data points.`,
};

const DEFAULT_SYSTEM = `You are an expert AI analyst for Digi Farms, an agricultural technology platform serving smallholder farmers in East Africa. 
Provide clear, data-driven, and actionable insights. Format responses with clear headings and bullet points.`;

const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];

export async function POST(req: Request) {
  try {
    const { module, context, prompt, entityId, entityLabel } = await req.json() as {
      module: string;
      context: string;         // structured data context (JSON stringified summary)
      prompt: string;          // user-defined follow-up question (optional, defaults to "Analyze this data")
      entityId?: string;
      entityLabel?: string;
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check and consume a prompt quota slot
    const quota = await checkAndConsumePrompt(session.user.id);
    if (!quota.allowed) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          const msg = `You've used all ${quota.limit} AI prompts for this month on the ${quota.tier} plan. Upgrade to get more.`;
          controller.enqueue(encoder.encode(JSON.stringify({ t: "quota", d: msg, used: quota.used, limit: quota.limit, tier: quota.tier }) + "\n"));
          controller.close();
        },
      });
      return new NextResponse(stream, { status: 403, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
    }

    const ai = new GoogleGenAI({ apiKey });
    const systemInstruction = SYSTEM_INSTRUCTIONS[module] ?? DEFAULT_SYSTEM;
    const modelName = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

    const fullPrompt = context
      ? `## Context Data\n\n${context}\n\n## Request\n\n${prompt || "Please analyze the above data and provide comprehensive insights."}`
      : prompt;

    const result = await ai.models.generateContentStream({
      model: modelName,
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      config: {
        systemInstruction,
        thinkingConfig: { thinkingBudget: 512 },   // moderate thinking for analysis
        safetySettings: SAFETY_SETTINGS as any,
      },
    });

    // Collect full response while streaming to save to DB
    let fullResponse = "";
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result) {
            const parts = chunk.candidates?.[0]?.content?.parts ?? [];
            for (const part of parts) {
              if (!part.text) continue;
              if ((part as any).thought) continue; // skip thought tokens for analysis
              fullResponse += part.text;
              controller.enqueue(encoder.encode(JSON.stringify({ t: "answer", d: part.text }) + "\n"));
            }
          }

          // Save to DB after streaming completes
          try {
            await db.aIConversation.create({
              data: {
                userId: session.user!.id,
                module,
                entityId: entityId ?? null,
                entityLabel: entityLabel ?? null,
                prompt: fullPrompt,
                response: fullResponse,
                model: modelName,
              },
            });
          } catch (dbErr) {
            console.error("[AI analyze] DB save error:", dbErr);
          }
        } catch (err: any) {
          const msg = err?.message ?? String(err);
          controller.enqueue(encoder.encode(JSON.stringify({ t: "error", d: msg }) + "\n"));
        } finally {
          controller.close();
        }
      },
    });

    return new NextResponse(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    const msg = err?.message ?? String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
