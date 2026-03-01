import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { auth } from "@/lib/auth";

const SYSTEM_PROMPT = `You are a helpful farming assistant. The user wants to find agrovets (agricultural supply shops) near their location.
Search for agrovets, farm supply stores, and agricultural input dealers near the given coordinates.
For each result, provide the name, address, phone if available, whether it's currently open, types of products/services they offer (seeds, fertilizers, pesticides, vet supplies, equipment), and any ratings.
Respond ONLY with valid JSON array (no markdown fences) in this format:
[
  {
    "name": "Shop Name",
    "address": "Full address",
    "phone": "+254...",
    "rating": 4.5,
    "reviews": 23,
    "open": true,
    "services": ["Seeds", "Fertilizers", "Pesticides"],
    "latitude": -0.3031,
    "longitude": 36.0800,
    "mapsUrl": "https://maps.google.com/?q=..."
  }
]
Return up to 10 results sorted by relevance/distance. If no results found, return an empty array [].`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { latitude, longitude, query } = await req.json();

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const modelName = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

    const userQuery = query || `Find agrovets and farm supply shops near latitude ${latitude}, longitude ${longitude}`;

    const result = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: "user", parts: [{ text: userQuery }] }],
      config: {
        systemInstruction: SYSTEM_PROMPT,
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: { latitude, longitude },
          },
        },
      },
    });

    const text = result.text?.trim() ?? "[]";

    // Extract Google Maps URIs from grounding metadata to add mapsUrl per result
    const groundingChunks: Array<{ maps?: { uri?: string; title?: string } }> =
      (result.candidates?.[0]?.groundingMetadata as any)?.groundingChunks ?? [];
    const mapsUris = groundingChunks
      .map((c) => c.maps?.uri)
      .filter((u): u is string => Boolean(u));

    try {
      const cleaned = text.replace(/```(?:json)?\s*/g, "").replace(/```\s*/g, "").trim();
      const agrovets: Array<Record<string, unknown>> = JSON.parse(cleaned);

      // Attach Google Maps URIs from grounding chunks when available
      const enriched = Array.isArray(agrovets)
        ? agrovets.map((a, i) => ({
            ...a,
            mapsUrl: a.mapsUrl || mapsUris[i] || null,
          }))
        : agrovets;

      return NextResponse.json(enriched);
    } catch {
      return NextResponse.json({ error: "Failed to parse results", raw: text }, { status: 502 });
    }
  } catch (err: any) {
    console.error("/api/agrovets error:", err);
    return NextResponse.json({ error: err?.message ?? "Search failed" }, { status: 500 });
  }
}
