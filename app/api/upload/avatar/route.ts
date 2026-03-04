import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { put, del, list } from "@vercel/blob";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
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
  const filename = `avatars/${session.user.id}${ext}`;

  // Remove any previous avatar blobs for this user
  const { blobs } = await list({ prefix: `avatars/${session.user.id}` });
  if (blobs.length > 0) {
    await del(blobs.map((b) => b.url));
  }

  const blob = await put(filename, buffer, { access: "public", contentType: file.type });
  const imageUrl = blob.url;
  await db.user.update({ where: { id: session.user.id }, data: { image: imageUrl } });

  return NextResponse.json({ success: true, imageUrl });
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
