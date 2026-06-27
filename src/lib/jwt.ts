// Warstwa JWT — edge-kompatybilna (tylko `jose`). Używana m.in. w middleware.
// Bez `server-only` i bez bcrypt, aby nie powiększać bundla edge.
import { SignJWT, jwtVerify } from "jose";
import type { Role } from "@/lib/types";

const SECRET = process.env.AUTH_SECRET ?? "dev-secret-change-me-min-32-characters!!";
const key = new TextEncoder().encode(SECRET);

export const SESSION_COOKIE = "sf_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 dni

export type SessionPayload = {
  sub: string;
  email: string;
  role: Role;
};

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email, role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(key);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ["HS256"] });
    if (!payload.sub || !payload.role) return null;
    return {
      sub: payload.sub,
      email: payload.email as string,
      role: payload.role as Role,
    };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  name: SESSION_COOKIE,
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};
