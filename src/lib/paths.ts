import path from "node:path";

/**
 * Folder that holds db/ and storage/. The production server (standalone build)
 * chdirs into .next/standalone, which a rebuild wipes - so data must live in
 * the project root in both dev and production. Override with DATA_DIR.
 */
function detectDataRoot(): string {
  if (process.env.DATA_DIR) return path.resolve(process.env.DATA_DIR);
  // Read through a variable so the build tracer does not copy the whole project.
  const getCwd = process.cwd.bind(process);
  const cwd = getCwd();
  return /[\\/]\.next[\\/]standalone$/.test(cwd) ? path.resolve(cwd, "..", "..") : cwd;
}

export const DATA_ROOT = detectDataRoot();
export const DB_DIR = path.join(DATA_ROOT, "db");
export const STORAGE_ROOT = path.join(DATA_ROOT, "storage");

/** Absolute SQLite URL; a relative DATABASE_URL would break once the server changes folder. */
export function databaseUrl(): string {
  const env = process.env.DATABASE_URL;
  if (env && (!env.startsWith("file:") || env.startsWith("file:/"))) return env;
  return `file:${path.join(DB_DIR, "custom.db")}`;
}
