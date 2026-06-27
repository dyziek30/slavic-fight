"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { profileSchema } from "@/lib/validation";

export type ProfileState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function updateProfile(_prev: ProfileState, formData: FormData): Promise<ProfileState> {
  const user = await requireUser();

  const parsed = profileSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    birthYear: formData.get("birthYear"),
    phone: formData.get("phone"),
    groupId: formData.get("groupId"),
  });

  if (!parsed.success) {
    return { error: "Sprawdź formularz", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  // Weryfikacja, że grupa istnieje i jest aktywna.
  const group = await prisma.group.findFirst({
    where: { id: parsed.data.groupId, active: true },
  });
  if (!group) {
    return { fieldErrors: { groupId: ["Wybrana grupa jest niedostępna"] } };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      birthYear: parsed.data.birthYear,
      phone: parsed.data.phone || null,
      // Trener/admin nie przypisują się do grupy treningowej jako uczestnicy
      groupId: user.role === "STUDENT" ? parsed.data.groupId : user.groupId,
      profileCompleted: true,
    },
  });

  revalidatePath("/dashboard/profil");
  revalidatePath("/dashboard");
  return { ok: true };
}
