import "server-only";
import { prisma } from "@/lib/prisma";

// Normalizacja pary uczestników, aby konwersacja była unikalna niezależnie od kolejności.
export function normalizePair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

export async function getOrCreateConversation(userA: string, userB: string) {
  const [participantAId, participantBId] = normalizePair(userA, userB);
  const existing = await prisma.conversation.findUnique({
    where: { participantAId_participantBId: { participantAId, participantBId } },
  });
  if (existing) return existing;
  return prisma.conversation.create({ data: { participantAId, participantBId } });
}

// Liczba nieprzeczytanych wiadomości dla użytkownika (nie licząc własnych).
export async function unreadCount(userId: string): Promise<number> {
  return prisma.message.count({
    where: {
      senderId: { not: userId },
      conversation: {
        OR: [{ participantAId: userId }, { participantBId: userId }],
      },
      reads: { none: { userId } },
    },
  });
}

// Oznacz wszystkie wiadomości w konwersacji jako przeczytane przez danego użytkownika.
export async function markConversationRead(conversationId: string, userId: string) {
  const unread = await prisma.message.findMany({
    where: { conversationId, senderId: { not: userId }, reads: { none: { userId } } },
    select: { id: true },
  });
  if (unread.length === 0) return;
  // upsert per wiadomość — odporne na wyścigi i zgodne z SQLite (brak skipDuplicates)
  await prisma.$transaction(
    unread.map((m) =>
      prisma.messageRead.upsert({
        where: { messageId_userId: { messageId: m.id, userId } },
        create: { messageId: m.id, userId },
        update: {},
      }),
    ),
  );
}

// Znajdź trenera (pierwszy TRAINER, w razie braku SUPER_ADMIN) — adresat wiadomości podopiecznego.
export async function findTrainerForStudent() {
  return (
    (await prisma.user.findFirst({ where: { role: "TRAINER", active: true } })) ??
    (await prisma.user.findFirst({ where: { role: "SUPER_ADMIN", active: true } }))
  );
}
