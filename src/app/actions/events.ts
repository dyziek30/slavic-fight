"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { eventSchema } from "@/lib/validation";

export type EventState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

function parseForm(formData: FormData) {
  return eventSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    date: formData.get("date"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    location: formData.get("location") || "Buszkowice 59A",
    groupIds: formData.getAll("groupIds").map(String).filter(Boolean),
  });
}

export async function createEvent(_prev: EventState, formData: FormData): Promise<EventState> {
  const user = await requireRole("TRAINER", "SUPER_ADMIN");
  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: "Sprawdź formularz", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;

  await prisma.event.create({
    data: {
      title: d.title,
      description: d.description || null,
      date: d.date,
      startTime: d.startTime,
      endTime: d.endTime,
      location: d.location,
      createdById: user.id,
      groups: { create: d.groupIds.map((groupId) => ({ groupId })) },
    },
  });

  revalidatePath("/dashboard/terminarz");
  return { ok: true };
}

export async function updateEvent(_prev: EventState, formData: FormData): Promise<EventState> {
  await requireRole("TRAINER", "SUPER_ADMIN");
  const id = formData.get("id") as string;
  if (!id) return { error: "Brak identyfikatora wydarzenia" };

  const parsed = parseForm(formData);
  if (!parsed.success) {
    return { error: "Sprawdź formularz", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;

  await prisma.$transaction([
    prisma.eventGroup.deleteMany({ where: { eventId: id } }),
    prisma.event.update({
      where: { id },
      data: {
        title: d.title,
        description: d.description || null,
        date: d.date,
        startTime: d.startTime,
        endTime: d.endTime,
        location: d.location,
        groups: { create: d.groupIds.map((groupId) => ({ groupId })) },
      },
    }),
  ]);

  revalidatePath("/dashboard/terminarz");
  return { ok: true };
}

export async function deleteEvent(formData: FormData): Promise<void> {
  await requireRole("TRAINER", "SUPER_ADMIN");
  const id = formData.get("id") as string;
  if (!id) return;
  await prisma.event.delete({ where: { id } });
  revalidatePath("/dashboard/terminarz");
}
