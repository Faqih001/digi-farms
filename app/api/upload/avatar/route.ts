import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

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
  const filename = `${session.user.id}${ext}`;

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "avatars");
  await mkdir(uploadsDir, { recursive: true });

  // Remove any previous avatar file for this user (other extensions)
  for (const old of [".jpg", ".png", ".webp"]) {
    const oldPath = path.join(uploadsDir, `${session.user.id}${old}`);
    if (existsSync(oldPath)) await unlink(oldPath).catch(() => null);
  }

  await writeFile(path.join(uploadsDir, filename), buffer);

  const imageUrl = `/uploads/avatars/${filename}`;
  await db.user.update({ where: { id: session.user.id }, data: { image: imageUrl } });

  return NextResponse.json({ success: true, imageUrl });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const uploadsDir = path.join(process.cwd(), "public", "uploads", "avatars");
  for (const ext of [".jpg", ".png", ".webp"]) {
    const filePath = path.join(uploadsDir, `${session.user.id}${ext}`);
    if (existsSync(filePath)) await unlink(filePath).catch(() => null);
  }

  await db.user.update({ where: { id: session.user.id }, data: { image: null } });

  return NextResponse.json({ success: true });
}
