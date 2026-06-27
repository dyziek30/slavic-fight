"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { hashPassword } from "@/lib/auth";
import { ROLES, type Role } from "@/lib/types";

export type AdminState = { ok?: boolean; error?: string; info?: string };

export async function changeUserRole(_prev: AdminState, formData: FormData): Promise<AdminState> {
  const admin = await requireRole("SUPER_ADMIN");
  const userId = formData.get("userId") as string;
  const role = formData.get("role") as Role;
  if (!userId || !ROLES.includes(role)) return { error: "Nieprawidłowe dane" };
  if (userId === admin.id) return { error: "Nie możesz zmienić własnej roli." };

  await prisma.user.update({
    where: { id: userId },
    // zmiana roli na nie-STUDENT odpina od grupy treningowej
    data: { role, groupId: role === "STUDENT" ? undefined : null },
  });
  revalidatePath("/dashboard/uzytkownicy");
  return { ok: true, info: "Rola zaktualizowana." };
}

export async function resetUserPassword(_prev: AdminState, formData: FormData): Promise<AdminState> {
  await requireRole("SUPER_ADMIN");
  const userId = formData.get("userId") as string;
  const newPassword = formData.get("newPassword") as string;
  if (!userId || !newPassword || newPassword.length < 8) {
    return { error: "Hasło musi mieć min. 8 znaków." };
  }
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash: await hashPassword(newPassword) },
  });
  revalidatePath("/dashboard/uzytkownicy");
  return { ok: true, info: "Hasło zostało zresetowane." };
}

export async function toggleUserActive(formData: FormData): Promise<void> {
  const admin = await requireRole("SUPER_ADMIN");
  const userId = formData.get("userId") as string;
  if (!userId || userId === admin.id) return;
  const u = await prisma.user.findUnique({ where: { id: userId } });
  if (!u) return;
  await prisma.user.update({ where: { id: userId }, data: { active: !u.active } });
  revalidatePath("/dashboard/uzytkownicy");
}

export async function deleteUser(formData: FormData): Promise<void> {
  const admin = await requireRole("SUPER_ADMIN");
  const userId = formData.get("userId") as string;
  if (!userId || userId === admin.id) return; // nie usuwaj samego siebie
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/dashboard/uzytkownicy");
}

// Ustawienia strony (klucz/wartość)
export async function saveSetting(formData: FormData): Promise<void> {
  await requireRole("SUPER_ADMIN");
  const key = formData.get("key") as string;
  const value = (formData.get("value") as string) ?? "";
  if (!key) return;
  await prisma.siteSetting.upsert({
    where: { key },
    create: { key, value },
    update: { value },
  });
  revalidatePath("/dashboard/ustawienia");
}

// Moderacja zgłoszeń kontaktowych
export async function updateContactStatus(formData: FormData): Promise<void> {
  await requireRole("SUPER_ADMIN", "TRAINER");
  const id = formData.get("id") as string;
  const status = formData.get("status") as "NEW" | "CONTACTED" | "ARCHIVED";
  if (!id) return;
  await prisma.contactSubmission.update({ where: { id }, data: { status } });
  revalidatePath("/dashboard");
}
