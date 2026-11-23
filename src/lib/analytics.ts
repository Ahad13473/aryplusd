import { createHash } from "node:crypto";

const BOT = /bot|crawl|spider|slurp|preview|fetch|monitor|lighthouse|headless|curl|wget|python|axios|facebookexternalhit|whatsapp|telegram/i;

export function isBot(ua: string): boolean {
  return !ua || BOT.test(ua);
}

export function dayKey(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

/** Daily-rotating hash: counts unique visitors per day without storing the IP. */
export function visitorHash(ip: string, ua: string, day: string): string {
  const salt = process.env.ANALYTICS_SALT || process.env.STREAM_REF_SECRET || "aryplusd";
  return createHash("sha256").update(`${salt}|${day}|${ip}|${ua}`).digest("hex").slice(0, 24);
}

export function deviceOf(ua: string): string {
  if (/ipad|tablet/i.test(ua)) return "tablet";
  if (/mobi|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}
