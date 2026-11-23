import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { DB_DIR } from "@/lib/paths";
import type { AnalysisResult, AryPlusAnalysis } from "@/lib/types";

/**
 * Stream URLs never reach the browser. They are sealed into opaque,
 * authenticated tokens (AES-256-GCM) that only this server can open, so the
 * Network tab shows "sr1.<random>" instead of the real CDN playlist address.
 */

const PREFIX = "sr1.";
const KEY_FILE = path.join(DB_DIR, ".stream-ref-key");

const g = globalThis as unknown as { __streamRefKey?: Buffer };

/** STREAM_REF_SECRET from .env if set, else a random key kept in db/ so tokens survive restarts. */
function key(): Buffer {
  if (g.__streamRefKey) return g.__streamRefKey;
  const secret = process.env.STREAM_REF_SECRET;
  let k: Buffer;
  if (secret) {
    k = createHash("sha256").update(secret).digest();
  } else if (existsSync(KEY_FILE)) {
    k = Buffer.from(readFileSync(KEY_FILE, "utf8").trim(), "hex");
  } else {
    k = randomBytes(32);
    mkdirSync(path.dirname(KEY_FILE), { recursive: true });
    writeFileSync(KEY_FILE, k.toString("hex"), { mode: 0o600 });
  }
  g.__streamRefKey = k;
  return k;
}

export function isStreamRef(value: string): boolean {
  return value.startsWith(PREFIX);
}

export function sealUrl(url: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([cipher.update(url, "utf8"), cipher.final()]);
  return PREFIX + Buffer.concat([iv, cipher.getAuthTag(), data]).toString("base64url");
}

export function openRef(ref: string): string {
  try {
    const raw = Buffer.from(ref.slice(PREFIX.length), "base64url");
    const decipher = createDecipheriv("aes-256-gcm", key(), raw.subarray(0, 12));
    decipher.setAuthTag(raw.subarray(12, 28));
    return Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8");
  } catch {
    throw new Error("This link has expired - search or paste it again.");
  }
}

/** Accepts either a sealed token or a URL the user typed, returns the real URL. */
export function resolveInputUrl(value: string): string {
  return isStreamRef(value) ? openRef(value) : value;
}

export function sealAryAnalysis(a: AryPlusAnalysis): AryPlusAnalysis {
  return {
    ...a,
    episodes: a.episodes.map((ep) => ({
      ...ep,
      streamUrl: ep.streamUrl ? sealUrl(ep.streamUrl) : ep.streamUrl,
    })),
  };
}

export function sealAnalysis(r: AnalysisResult): AnalysisResult {
  return {
    ...r,
    finalUrl: sealUrl(r.finalUrl),
    variants: r.variants?.map((v) => ({ ...v, url: sealUrl(v.url), codecs: null })),
  };
}
