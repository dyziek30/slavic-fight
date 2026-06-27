import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader, Badge, EmptyState } from "@/components/dashboard/ui";
import { EventManager, type EventDTO } from "@/components/dashboard/EventManager";
import { formatShortDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

function toDateInput(d: Date) {
  return new Date(d).toISOString().slice(0, 10);
}

export default async function TerminarzPage() {
  const user = await requireUser();
  const isStaff = user.role === "TRAINER" || user.role === "SUPER_ADMIN";

  if (isStaff) {
    const [events, groups] = await Promise.all([
      prisma.event.findMany({
        orderBy: { date: "asc" },
        include: { groups: { include: { group: { select: { id: true, name: true } } } } },
      }),
      prisma.group.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    ]);

    const dto: EventDTO[] = events.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      date: toDateInput(e.date),
      startTime: e.startTime,
      endTime: e.endTime,
      location: e.location,
      groupIds: e.groups.map((g) => g.group.id),
      groupNames: e.groups.map((g) => g.group.name),
    }));

    return (
      <>
        <PageHeader title="Terminarz" subtitle="Zarządzaj zajęciami i wydarzeniami dla grup." />
        <EventManager events={dto} groups={groups} />
      </>
    );
  }

  // STUDENT — tylko wydarzenia jego grupy
  if (!user.groupId) {
    return (
      <>
        <PageHeader title="Terminarz" />
        <EmptyState>
          <p>Nie masz jeszcze przypisanej grupy.</p>
          <a href="/dashboard/profil" className="btn-primary btn-sm mt-2">Wybierz grupę</a>
        </EmptyState>
      </>
    );
  }

  const events = await prisma.event.findMany({
    where: { groups: { some: { groupId: user.groupId } } },
    orderBy: { date: "asc" },
  });
  const now = new Date(new Date().toDateString());
  const upcoming = events.filter((e) => e.date >= now);
  const past = events.filter((e) => e.date < now);

  return (
    <>
      <PageHeader title="Terminarz" subtitle={`Zajęcia grupy: ${user.group?.name ?? ""}`} />
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-smoke">Nadchodzące</h2>
        {upcoming.length === 0 ? (
          <div className="card p-8 text-center text-smoke">Brak nadchodzących zajęć.</div>
        ) : (
          <div className="space-y-3">
            {upcoming.map((e) => (
              <div key={e.id} className="card p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-chalk">{e.title}</p>
                  <Badge>{e.startTime}–{e.endTime}</Badge>
                </div>
                <p className="mt-1 text-xs text-smoke">{formatShortDate(e.date)} · {e.location}</p>
                {e.description && <p className="mt-2 text-sm text-smoke">{e.description}</p>}
              </div>
            ))}
          </div>
        )}
      </section>

      {past.length > 0 && (
        <section className="mt-10 opacity-70">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-smoke">Minione</h2>
          <div className="space-y-2">
            {past.slice(-5).reverse().map((e) => (
              <div key={e.id} className="card flex items-center justify-between p-3 text-sm">
                <span className="text-chalk">{e.title}</span>
                <span className="text-smoke">{formatShortDate(e.date)}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
