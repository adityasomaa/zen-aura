import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "zen-admin";

function tokenFor(secret: string) {
  return crypto.createHash("sha256").update(secret).digest("hex");
}

export async function isAuthed(): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;
  return token === tokenFor(secret);
}

export function adminCookieName() {
  return COOKIE_NAME;
}

export function adminCookieValue(secret: string) {
  return tokenFor(secret);
}
