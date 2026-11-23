import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Admin login: one password from ADMIN_PASSWORD in .env.
 * The session is a signed, expiring cookie - nothing is stored server-side.
 */
export const ADMIN_COOKIE = "aryplusd_admin";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export function adminEnabled(): boolean {
  return (process.env.ADMIN_PASSWORD ?? "").length >= 8;
}

function secret(): Buffer {
  const base = process.env.ADMIN_SESSION_SECRET || `${process.env.ADMIN_PASSWORD}|aryplusd-admin`;
  return createHash("sha256").update(base).digest();
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function passwordMatches(input: string): boolean {
  if (!adminEnabled()) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(process.env.ADMIN_PASSWORD as string).digest();
  return timingSafeEqual(a, b);
}

export function createSession(): { value: string; maxAge: number } {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  return { value: `${exp}.${sign(String(exp))}`, maxAge: MAX_AGE };
}

export function sessionValid(value: string | undefined): boolean {
  if (!value || !adminEnabled()) return false;
  const [exp, sig] = value.split(".");
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  const expected = Buffer.from(sign(exp));
  const got = Buffer.from(sig);
  return expected.length === got.length && timingSafeEqual(expected, got);
}

/** For server components and route handlers. */
export async function isAdmin(): Promise<boolean> {
  return sessionValid((await cookies()).get(ADMIN_COOKIE)?.value);
}
