import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader, Badge } from "@/components/dashboard/ui";
import { TrainerComposer } from "@/components/dashboard/MessageComposer";
import { formatDateTime, initials } from "@/lib/utils";
import { ROLE_LABELS } from "@/lib/constants";

export const dynamic = "force-dynamic";

type Party = { id: string; firstName: string | null; lastName: string | null; email: string; role: string };
function display(u: Party) {
  return [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email.split("@")[0];
}

export default async function WiadomosciPage() {
  const user = await requireUser();
  const isAdmin = user.role === "SUPER_ADMIN";

  const conversations = await prisma.conversation.findMany({
    where: isAdmin ? {} : { OR: [{ participantAId: user.id }, { participantBId: user.id }] },
    orderBy: { lastMessageAt: "desc" },
    include: {
      participantA: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
      participantB: { select: { id: true, firstName: true, lastName: true, email: true, role: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  const convoIds = conversations.map((c) => c.id);
  const unreadGroups = convoIds.length
    ? await prisma.message.groupBy({
        by: ["conversationId"],
        where: {
          conversationId: { in: convoIds },
          senderId: { not: user.id },
          reads: { none: { userId: user.id } },
        },
        _count: { _all: true },
      })
    : [];
  const unreadMap = new Map(unreadGroups.map((g) => [g.conversationId, g._count._all]));

  return (
    <>
      <PageHeader
        title="Wiadomości"
        subtitle={isAdmin ? "Wszystkie rozmowy w systemie (moderacja)." : "Twoja skrzynka odbiorcza."}
      />

      {user.role === "STUDENT" && conversations.length === 0 && (
        <div className="mb-6">
          <TrainerComposer />
        </div>
      )}

      {conversations.length === 0 ? (
        <div className="card p-10 text-center text-smoke">Brak rozmów.</div>
      ) : (
        <div className="card divide-y divide-steel/50">
          {conversations.map((c) => {
            const other = isAdmin
              ? null
              : c.participantA.id === user.id
                ? c.participantB
                : c.participantA;
            const unread = unreadMap.get(c.id) ?? 0;
            const last = c.messages[0];

            return (
              <Link
                key={c.id}
                href={`/dashboard/wiadomosci/${c.id}`}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-white/5"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold">
                  {isAdmin
                    ? "↔"
                    : initials(other!.firstName, other!.lastName, other!.email)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-semibold text-chalk">
                      {isAdmin
                        ? `${display(c.participantA)} ↔ ${display(c.participantB)}`
                        : display(other!)}
                    </p>
                    {last && <span className="shrink-0 text-xs text-smoke">{formatDateTime(last.createdAt)}</span>}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm text-smoke">{last?.body ?? "Brak wiadomości"}</p>
                    {unread > 0 && <Badge tone="alert">{unread}</Badge>}
                  </div>
                  {!isAdmin && other && (
                    <span className="text-[11px] text-smoke/70">{ROLE_LABELS[other.role]}</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
