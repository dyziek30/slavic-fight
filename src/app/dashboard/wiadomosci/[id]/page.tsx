import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { markConversationRead } from "@/lib/messaging";
import { ReplyComposer } from "@/components/dashboard/MessageComposer";
import { formatDateTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Party = { id: string; firstName: string | null; lastName: string | null; email: string };
function display(u: Party) {
  return [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email.split("@")[0];
}

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requireUser();
  const isAdmin = user.role === "SUPER_ADMIN";

  const convo = await prisma.conversation.findUnique({
    where: { id },
    include: {
      participantA: { select: { id: true, firstName: true, lastName: true, email: true } },
      participantB: { select: { id: true, firstName: true, lastName: true, email: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!convo) notFound();

  const isParticipant = convo.participantAId === user.id || convo.participantBId === user.id;
  if (!isParticipant && !isAdmin) notFound();

  // Oznacz jako przeczytane (dla uczestnika)
  if (isParticipant) await markConversationRead(convo.id, user.id);

  const other = convo.participantA.id === user.id ? convo.participantB : convo.participantA;
  const title = isAdmin && !isParticipant
    ? `${display(convo.participantA)} ↔ ${display(convo.participantB)}`
    : display(other);

  return (
    <div className="mx-auto flex h-[calc(100vh-8rem)] max-w-2xl flex-col">
      <div className="mb-4 flex items-center gap-3">
        <Link href="/dashboard/wiadomosci" className="text-smoke hover:text-chalk">←</Link>
        <h1 className="heading-display text-xl">{title}</h1>
        {isAdmin && !isParticipant && <span className="badge bg-ash/40 text-smoke">podgląd admina</span>}
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto rounded-xl border border-steel bg-coal/50 p-4">
        {convo.messages.length === 0 ? (
          <p className="py-12 text-center text-sm text-smoke">Brak wiadomości. Napisz pierwszą.</p>
        ) : (
          convo.messages.map((m) => {
            const mine = m.senderId === user.id;
            return (
              <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                    mine ? "bg-chalk text-ink" : "bg-graphite text-chalk",
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.body}</p>
                  <p className={cn("mt-1 text-[10px]", mine ? "text-ink/60" : "text-smoke")}>
                    {formatDateTime(m.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="mt-4">
        {isParticipant ? (
          <ReplyComposer conversationId={convo.id} />
        ) : (
          <p className="text-center text-sm text-smoke">
            Podgląd administratora — odpowiadać mogą tylko uczestnicy rozmowy.
          </p>
        )}
      </div>
    </div>
  );
}
