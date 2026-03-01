import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are DIGI Assistant, an expert AI farming companion for the DIGI-FARMS precision agriculture platform serving smallholder farmers in East Africa.
You help with crop diagnostics, soil health, planting schedules, pest and disease management, input recommendations, market prices, and agri-finance.
Be concise, practical, and empathetic. Use simple language suitable for farmers.
If asked about non-farming topics, politely redirect to your agriculture expertise.`;

const SAFETY_SETTINGS = [
  { category: "HARM_CATEGORY_HARASSMENT",        threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_HATE_SPEECH",        threshold: "BLOCK_MEDIUM_AND_ABOVE" },
  { category: "HARM_CATEGORY_DANGEROUS_CONTENT",  threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];

export async function POST(req: Request) {
  try {
    const { messages = [], model: clientModel } = await req.json() as {
      messages: Array<{ role: "user" | "assistant"; text: string }>;
      model?: string;
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY in environment" }, { status: 500 });
    }

    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== "user") {
      return NextResponse.json({ error: "Last message must be from the user" }, { status: 400 });
    }

    // gemini-2.5-flash: best balance of speed, cost, and deep reasoning with dynamic thinking
    const modelName = clientModel ?? process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

    const ai = new GoogleGenAI({ apiKey });

    // Full conversation history including the latest user message
    const contents = messages.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

    const result = await ai.models.generateContentStream({
      model: modelName,
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        // Dynamic thinking: model decides how much to reason based on task complexity.
        // includeThoughts: true surfaces the reasoning summary so the UI can show it.
        thinkingConfig: {
          includeThoughts: true,
          thinkingBudget: -1,   // -1 = dynamic (default for 2.5-flash)
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        safetySettings: SAFETY_SETTINGS as any,
      },
    });

    // Stream NDJSON lines: {"t":"thought","d":"..."} or {"t":"answer","d":"..."}
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result) {
            const parts = chunk.candidates?.[0]?.content?.parts ?? [];
            for (const part of parts) {
              if (!part.text) continue;
              const line = JSON.stringify({ t: (part as any).thought ? "thought" : "answer", d: part.text });
              controller.enqueue(encoder.encode(line + "\n"));
            }
          }
        } catch (err: any) {
          const line = JSON.stringify({ t: "error", d: err?.message ?? String(err) });
          controller.enqueue(encoder.encode(line + "\n"));
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
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

