import { getToken } from "next-auth/jwt";

export async function GET(req: Request) {
  const cookies = req.headers.get("cookie") ?? "";
  const host = req.headers.get("host") ?? "";
  const userAgent = req.headers.get("user-agent") ?? "";

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET });

  return new Response(
    JSON.stringify({
      cookies,
      host,
      userAgent,
      token: token ?? null,
    }, null, 2),
    { headers: { "Content-Type": "application/json" } }
  );
}
