import "server-only";
import bcrypt from "bcryptjs";

// Hasła (bcrypt, runtime Node). Logika JWT/sesji znajduje się w `@/lib/jwt`
// (edge-kompatybilna) — tutaj ją re-eksportujemy dla wygody warstwy serwerowej.
export {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  signSession,
  verifySession,
  sessionCookieOptions,
  type SessionPayload,
} from "@/lib/jwt";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
