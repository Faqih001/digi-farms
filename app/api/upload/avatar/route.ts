import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { put, del, list } from "@vercel/blob";
import { retryAsync } from "@/lib/utils";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Use JPEG, PNG, or WebP." }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Max 5 MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.type === "image/png" ? ".png" : file.type === "image/webp" ? ".webp" : ".jpg";
    // include a timestamp to force a new blob URL on each upload (avoids client caching)
    const filename = `avatars/${session.user.id}-${Date.now()}${ext}`;

    // Remove any previous avatar blobs for this user
    try {
      const { blobs } = await list({ prefix: `avatars/${session.user.id}` });
      if (blobs.length > 0) {
        await del(blobs.map((b) => b.url));
      }
    } catch (err) {
      console.error("avatar:blob-cleanup-error", err instanceof Error ? err.message : String(err));
      // continue — cleanup failure shouldn't block upload
    }

    const blob = await put(filename, buffer, { access: "public", contentType: file.type });
    const imageUrl = blob.url;

    try {
      await retryAsync(() => db.user.update({ where: { id: session.user.id }, data: { image: imageUrl } }));
    } catch (err) {
      // Log Prisma/DB errors with helpful structure for debugging
      try {
        // @ts-ignore
        console.error("prisma:error", err?.message ?? String(err), { code: err?.code, meta: err?.meta, stack: err?.stack });
      } catch (logErr) {
        console.error("prisma:error (logging failed)", logErr);
      }
      // Return a clear error to the client
      return NextResponse.json({ error: "Failed to save avatar. Database error." }, { status: 500 });
    }

    return NextResponse.json({ success: true, imageUrl });
  } catch (err) {
    console.error("avatar:unexpected-error", err instanceof Error ? err.message : String(err), err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { blobs } = await list({ prefix: `avatars/${session.user.id}` });
  if (blobs.length > 0) {
    await del(blobs.map((b) => b.url));
  }

  await db.user.update({ where: { id: session.user.id }, data: { image: null } });

  return NextResponse.json({ success: true });
}
