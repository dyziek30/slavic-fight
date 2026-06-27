"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { messageSchema } from "@/lib/validation";
import { getOrCreateConversation, findTrainerForStudent } from "@/lib/messaging";

export type MessageState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

async function canAccessConversation(userId: string, role: string, conversationId: string) {
  const convo = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!convo) return null;
  const isParticipant = convo.participantAId === userId || convo.participantBId === userId;
  // SUPER_ADMIN może czytać/moderować wszystkie rozmowy.
  if (!isParticipant && role !== "SUPER_ADMIN") return null;
  return convo;
}

// Podopieczny rozpoczyna/kontynuuje rozmowę z trenerem (bez podawania odbiorcy).
export async function messageTrainer(_prev: MessageState, formData: FormData): Promise<MessageState> {
  const user = await requireUser();
  const parsed = messageSchema.safeParse({ body: formData.get("body") });
  if (!parsed.success) {
    return { error: "Sprawdź formularz", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const trainer = await findTrainerForStudent();
  if (!trainer || trainer.id === user.id) {
    return { error: "Brak dostępnego trenera do kontaktu." };
  }

  const convo = await getOrCreateConversation(user.id, trainer.id);
  await prisma.$transaction([
    prisma.message.create({
      data: { conversationId: convo.id, senderId: user.id, body: parsed.data.body },
    }),
    prisma.conversation.update({
      where: { id: convo.id },
      data: { lastMessageAt: new Date() },
    }),
  ]);

  revalidatePath("/dashboard/wiadomosci");
  return { ok: true };
}

// Odpowiedź w istniejącej konwersacji (trener -> podopieczny, podopieczny -> trener, admin).
export async function replyMessage(_prev: MessageState, formData: FormData): Promise<MessageState> {
  const user = await requireUser();
  const conversationId = formData.get("conversationId") as string;
  const parsed = messageSchema.safeParse({ body: formData.get("body") });
  if (!parsed.success) {
    return { error: "Sprawdź formularz", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const convo = await canAccessConversation(user.id, user.role, conversationId);
  if (!convo) return { error: "Brak dostępu do tej rozmowy." };

  await prisma.$transaction([
    prisma.message.create({
      data: { conversationId, senderId: user.id, body: parsed.data.body },
    }),
    prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    }),
  ]);

  revalidatePath(`/dashboard/wiadomosci/${conversationId}`);
  revalidatePath("/dashboard/wiadomosci");
  return { ok: true };
}
