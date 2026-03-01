import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const PROMPT = `You are an agricultural weather assistant for East African farmers.
Using the latest available information from Google Search, provide:

1. **current** – Current weather for the given location:
   { "temp": number (°C), "feelsLike": number, "humidity": number (%), "wind": number (km/h), "rain": number (mm today), "uvIndex": string, "condition": string, "location": string }

2. **forecast** – 7-day forecast array:
   [{ "day": string (e.g. "Today","Mon"), "high": number, "low": number, "rain": number (% chance), "condition": string }]

3. **advisories** – 3 farming-specific advisories for the location:
   [{ "msg": string, "type": "warning"|"success"|"info" }]

4. **seasonal** – Seasonal outlook:
   { "longRains": "Good"|"Below Normal"|"Above Normal", "shortRains": "Good"|"Below Normal"|"Above Normal", "enso": string, "droughtRisk": "Low"|"Moderate"|"High" }

Return ONLY valid JSON: { "current": {...}, "forecast": [...], "advisories": [...], "seasonal": {...} }`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { lat, lng, location } = await req.json();
  const locStr = location || `latitude ${lat}, longitude ${lng}`;

  const res = await ai.models.generateContent({
    model: MODEL,
    contents: `${PROMPT}\n\nLocation: ${locStr}`,
    config: {
      tools: [{ googleSearch: {} }],
      temperature: 0.3,
    },
  });

  const text = res.text ?? "";
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return NextResponse.json({ error: "Failed to parse weather data" }, { status: 500 });

  try {
    const data = JSON.parse(jsonMatch[0]);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Invalid JSON from AI" }, { status: 500 });
  }
}
