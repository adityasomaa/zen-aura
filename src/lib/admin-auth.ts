import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "zen-admin";

function tokenFor(username: string, password: string) {
  return crypto
    .createHash("sha256")
    .update(`${username}:${password}`)
    .digest("hex");
}

/**
 * Resolve admin credentials.
 *
 * Primary: ADMIN_USERNAME + ADMIN_PASSWORD env vars.
 * Fallback (kept for backward compatibility with earlier deploys):
 *   ADMIN_SECRET is treated as the password, with username "admin".
 */
function credentials() {
  const u = process.env.ADMIN_USERNAME?.trim();
  const p = process.env.ADMIN_PASSWORD;
  if (u && p) return { username: u, password: p };
  const legacy = process.env.ADMIN_SECRET;
  if (legacy) return { username: "admin", password: legacy };
  return null;
}

export function verifyCredentials(username: string, password: string): boolean {
  const c = credentials();
  if (!c) return false;
  // Constant-time compare to avoid trivial timing attacks
  const a = Buffer.from(tokenFor(username, password));
  const b = Buffer.from(tokenFor(c.username, c.password));
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function isAuthed(): Promise<boolean> {
  const c = credentials();
  if (!c) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const expected = tokenFor(c.username, c.password);
  if (token.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}

export function adminCookieName() {
  return COOKIE_NAME;
}

export function adminCookieValue(username: string, password: string) {
  return tokenFor(username, password);
}
