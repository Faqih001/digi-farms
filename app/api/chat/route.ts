import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages = [], model = process.env.GEMINI_MODEL ?? "gemini-proto-1" } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY in environment" }, { status: 500 });
    }

    // Basic proxy to the Gemini / Generative AI endpoint. The exact endpoint and
    // request shape can be adjusted per the Google Gemini docs you referenced.
    const base = process.env.GEMINI_API_BASE ?? "https://api.generativeai.googleapis.com/v1beta2";
    const url = `${base}/models/${model}:generateMessage`;

    // Convert incoming messages to a simple text prompt (you can expand this
    // to a richer message structure following Google's API shapes).
    const prompt = messages
      .map((m: any) => (m.role === "user" ? `User: ${m.text}` : `Assistant: ${m.text}`))
      .join("\n") + "\nAssistant:";

    const body = {
      prompt: {
        text: prompt,
      },
      temperature: 0.2,
      candidate_count: 1,
    };

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });

    // Stream the provider response back to the client (if it streams).
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text || `Provider returned ${res.status}` }, { status: 502 });
    }

    const proxiedStream = res.body;
    if (!proxiedStream) {
      const text = await res.text();
      return NextResponse.json({ error: text || "Empty response from provider" }, { status: 502 });
    }

    // Pass through the stream directly. The client will read it as a streaming
    // response and append chunks into the assistant message.
    return new NextResponse(proxiedStream, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err) }, { status: 500 });
  }
}
