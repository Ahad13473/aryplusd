import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, adminEnabled, createSession, passwordMatches } from "@/lib/admin-auth";

export const runtime = "nodejs";

/** POST /api/admin/login { password } */
export async function POST(req: NextRequest) {
  if (!adminEnabled()) {
    return NextResponse.json({ error: "Admin is disabled. Set ADMIN_PASSWORD (8+ characters) in .env and restart." }, { status: 503 });
  }
  const { password } = (await req.json().catch(() => ({}))) as { password?: unknown };
  if (typeof password !== "string" || !passwordMatches(password)) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  const s = createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, s.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production" && req.nextUrl.protocol === "https:",
    path: "/",
    maxAge: s.maxAge,
  });
  return res;
}
