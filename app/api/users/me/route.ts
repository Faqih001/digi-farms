import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrismaError } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const user = await db.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, name: true, email: true, image: true, role: true, isVerified: true, isActive: true },
    });

    return NextResponse.json({ user });
  } catch (err) {
    const info = formatPrismaError(err);
    // Log structured error for easier debugging
    // eslint-disable-next-line no-console
    console.error("prisma:error", info);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
