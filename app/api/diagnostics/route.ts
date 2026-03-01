import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

const DIAGNOSIS_PROMPT = `You are an expert agricultural pathologist. Analyze this crop image and provide a diagnosis.

Respond ONLY with valid JSON in this exact format (no markdown, no code fences):
{
  "disease": "Name of the disease, pest, or deficiency detected",
  "confidence": 85,
  "severity": "LOW" | "MEDIUM" | "HIGH",
  "crop": "Identified crop type",
  "status": "HEALTHY" | "DISEASED" | "AT_RISK" | "UNKNOWN",
  "treatment": "Specific recommended treatment with dosage and application method",
  "prevention": "Prevention tips for future seasons"
}

If the image is not a crop/plant photo, set disease to "Not a crop image", confidence to 0, severity to "LOW", and status to "UNKNOWN".
Be specific with treatment dosages and methods relevant to East African smallholder farmers.`;

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const farmId = formData.get("farmId") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type. Use JPEG, PNG, or WebP." }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "File too large. Max 10 MB." }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 });
  }

  // Verify the user has a farm
  let resolvedFarmId = farmId;
  if (!resolvedFarmId) {
    const farm = await db.farm.findFirst({ where: { userId: session.user.id }, select: { id: true } });
    if (!farm) {
      return NextResponse.json({ error: "No farm found. Create a farm profile first." }, { status: 400 });
    }
    resolvedFarmId = farm.id;
  }

  try {
    // Read image bytes for Gemini inline data
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");

    // Save image to disk
    const ext = file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg";
    const filename = `diag_${session.user.id}_${Date.now()}${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads", "diagnostics");
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, filename), buffer);
    const imageUrl = `/uploads/diagnostics/${filename}`;

    // Call Gemini with inline image data
    const ai = new GoogleGenAI({ apiKey });
    const modelName = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

    const result = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          role: "user",
          parts: [
            { inlineData: { mimeType: file.type, data: base64 } },
            { text: DIAGNOSIS_PROMPT },
          ],
        },
      ],
    });

    const text = result.text?.trim() ?? "";

    // Parse the JSON response
    let diagnosis: {
      disease: string;
      confidence: number;
      severity: string;
      crop: string;
      status: string;
      treatment: string;
      prevention: string;
    };

    try {
      // Strip any markdown code fences if present
      const cleaned = text.replace(/```(?:json)?\s*/g, "").replace(/```\s*/g, "").trim();
      diagnosis = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({
        error: "Failed to parse AI response",
        raw: text,
      }, { status: 502 });
    }

    // Map status string to CropStatus enum
    const statusMap: Record<string, string> = {
      HEALTHY: "HEALTHY",
      DISEASED: "DISEASED",
      AT_RISK: "AT_RISK",
      UNKNOWN: "UNKNOWN",
    };
    const cropStatus = statusMap[diagnosis.status] ?? "UNKNOWN";

    // Save to database
    const diagnostic = await db.diagnostic.create({
      data: {
        farmId: resolvedFarmId,
        imageUrl,
        disease: diagnosis.disease,
        confidence: diagnosis.confidence,
        severity: diagnosis.severity,
        recommendations: JSON.stringify({
          crop: diagnosis.crop,
          treatment: diagnosis.treatment,
          prevention: diagnosis.prevention,
        }),
        status: cropStatus as any,
        aiModelVersion: modelName,
      },
    });

    return NextResponse.json({
      id: diagnostic.id,
      disease: diagnosis.disease,
      confidence: diagnosis.confidence,
      severity: diagnosis.severity,
      crop: diagnosis.crop,
      status: diagnosis.status,
      treatment: diagnosis.treatment,
      prevention: diagnosis.prevention,
      imageUrl,
      createdAt: diagnostic.createdAt,
    });
  } catch (err: any) {
    console.error("/api/diagnostics error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Diagnosis failed" },
      { status: 500 }
    );
  }
}

// GET: Fetch diagnostic history for the current user's farm
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") ?? "all";

  // Find user's farms
  const farms = await db.farm.findMany({
    where: { userId: session.user.id },
    select: { id: true },
  });
  if (farms.length === 0) {
    return NextResponse.json([]);
  }
  const farmIds = farms.map((f) => f.id);

  // Build date filter
  let dateFilter: any = {};
  const now = new Date();
  if (period === "day") {
    dateFilter = { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) };
  } else if (period === "week") {
    dateFilter = { gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
  } else if (period === "month") {
    dateFilter = { gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
  } else if (period === "year") {
    dateFilter = { gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) };
  }

  const where: any = { farmId: { in: farmIds } };
  if (Object.keys(dateFilter).length > 0) {
    where.createdAt = dateFilter;
  }

  const diagnostics = await db.diagnostic.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Parse recommendations JSON for each diagnostic
  const formatted = diagnostics.map((d) => {
    let recs: any = {};
    try {
      recs = d.recommendations ? JSON.parse(d.recommendations) : {};
    } catch {}
    return {
      id: d.id,
      disease: d.disease,
      confidence: d.confidence,
      severity: d.severity,
      status: d.status,
      imageUrl: d.imageUrl,
      crop: recs.crop ?? "Unknown",
      treatment: recs.treatment ?? "",
      prevention: recs.prevention ?? "",
      createdAt: d.createdAt,
    };
  });

  return NextResponse.json(formatted);
}
