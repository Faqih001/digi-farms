import { NextResponse } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `You are DIGI Assistant, an expert AI farming companion for the DIGI-FARMS precision agriculture platform serving smallholder farmers in East Africa. 
You help with crop diagnostics, soil health, planting schedules, pest and disease management, input recommendations, market prices, and agri-finance.
Be concise, practical, and empathetic. Use simple language suitable for farmers. 
If asked about non-farming topics, politely redirect to your agriculture expertise.`;

/** Basic content-safety allow-list — block clearly harmful content only */
const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT,       threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
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

    const modelName = clientModel ?? process.env.GEMINI_MODEL ?? "gemini-2.0-flash";
    const genAI = new GoogleGenerativeAI(apiKey);

    const geminiModel = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_INSTRUCTION,
      safetySettings,
    });

    // Build the multi-turn history (all but the last user message)
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== "user") {
      return NextResponse.json({ error: "Last message must be from the user" }, { status: 400 });
    }

    const chat = geminiModel.startChat({ history });
    const result = await chat.sendMessageStream(lastMsg.text);

    // Stream the text chunks as plain text SSE back to the client
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (err: any) {
          controller.enqueue(encoder.encode(`\n[Error: ${err?.message ?? String(err)}]`));
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
