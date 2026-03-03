import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();

  return new Response(
    JSON.stringify({ session: session ?? null }, null, 2),
    { headers: { "Content-Type": "application/json" } }
  );
}
