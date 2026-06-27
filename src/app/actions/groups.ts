"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { groupSchema } from "@/lib/validation";

export type GroupState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function createGroup(_prev: GroupState, formData: FormData): Promise<GroupState> {
  const user = await requireRole("TRAINER", "SUPER_ADMIN");
  const parsed = groupSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });
  if (!parsed.success) {
    return { error: "Sprawdź formularz", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.group.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      active: parsed.data.active,
      createdById: user.id,
    },
  });

  revalidatePath("/dashboard/grupy");
  return { ok: true };
}

export async function updateGroup(_prev: GroupState, formData: FormData): Promise<GroupState> {
  await requireRole("TRAINER", "SUPER_ADMIN");
  const id = formData.get("id") as string;
  if (!id) return { error: "Brak identyfikatora grupy" };

  const parsed = groupSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });
  if (!parsed.success) {
    return { error: "Sprawdź formularz", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  await prisma.group.update({
    where: { id },
    data: {
      name: parsed.data.name,
      description: parsed.data.description || null,
      active: parsed.data.active,
    },
  });

  revalidatePath("/dashboard/grupy");
  return { ok: true };
}

export async function deleteGroup(formData: FormData): Promise<void> {
  await requireRole("TRAINER", "SUPER_ADMIN");
  const id = formData.get("id") as string;
  if (!id) return;
  // Członkowie zostają (groupId -> null wg schematu onDelete: SetNull),
  // powiązania z wydarzeniami kasują się kaskadowo.
  await prisma.group.delete({ where: { id } });
  revalidatePath("/dashboard/grupy");
}
