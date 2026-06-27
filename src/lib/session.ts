import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { Role } from "@/lib/types";
import { prisma } from "@/lib/prisma";
import {
  SESSION_COOKIE,
  signSession,
  verifySession,
  sessionCookieOptions,
  type SessionPayload,
} from "@/lib/auth";

// Ustaw cookie sesji (po logowaniu/rejestracji)
export async function createSession(payload: SessionPayload) {
  const token = await signSession(payload);
  const store = await cookies();
  store.set(sessionCookieOptions.name, token, sessionCookieOptions);
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

// Lekka sesja z cookie (bez zapytania do DB) — do szybkich sprawdzeń.
export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
});

// Pełny użytkownik z DB (z grupą). Cache w obrębie jednego renderu.
export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    include: { group: true },
  });
  if (!user || !user.active) return null;
  return user;
});

// Wymuś zalogowanie — przekierowanie na /login z powrotem.
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

// Wymuś konkretne role.
export async function requireRole(...roles: Role[]) {
  const user = await requireUser();
  if (!roles.includes(user.role as Role)) redirect("/dashboard");
  return user;
}
