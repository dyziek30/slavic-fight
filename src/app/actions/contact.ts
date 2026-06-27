"use server";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";

export type ActionState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitContact(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { error: "Sprawdź formularz", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await prisma.contactSubmission.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email || null,
        message: parsed.data.message,
      },
    });
    return { ok: true };
  } catch {
    return { error: "Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń." };
  }
}
