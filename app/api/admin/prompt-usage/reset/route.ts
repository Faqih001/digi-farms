import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resetPromptUsageForUser, resetAllPromptUsage } from "@/lib/actions/promptUsage";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { userId } = body as { userId?: string };

    if (userId) {
      await resetPromptUsageForUser(userId);
      return NextResponse.json({ success: true, userId });
    }

    await resetAllPromptUsage();
    return NextResponse.json({ success: true, all: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
