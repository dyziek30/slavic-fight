"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { createSession, destroySession } from "@/lib/session";
import { registerSchema, loginSchema } from "@/lib/validation";
import type { Role } from "@/lib/types";

export type AuthState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function registerAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { error: "Sprawdź formularz", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { fieldErrors: { email: ["Konto z tym adresem już istnieje"] } };
  }

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: await hashPassword(password),
      role: "STUDENT",
    },
  });

  await createSession({ sub: user.id, email: user.email, role: user.role as Role });
  redirect("/dashboard/profil?welcome=1");
}

export async function loginAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Sprawdź formularz", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const { email, password } = parsed.data;
  const redirectTo = (formData.get("redirect") as string) || "/dashboard";

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.active || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Nieprawidłowy e-mail lub hasło" };
  }

  await createSession({ sub: user.id, email: user.email, role: user.role as Role });
  redirect(redirectTo.startsWith("/") ? redirectTo : "/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/");
}
