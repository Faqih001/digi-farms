import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const farms = await db.farm.findMany({
    where: { userId: session.user.id },
    include: { crops: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(farms);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const farm = await db.farm.create({
    data: {
      ...body,
      userId: session.user.id,
    },
  });

  return NextResponse.json(farm, { status: 201 });
}
