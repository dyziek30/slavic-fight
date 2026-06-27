import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { unreadCount } from "@/lib/messaging";
import { PageHeader, StatCard, Badge } from "@/components/dashboard/ui";
import { formatShortDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardHome() {
  const user = await requireUser();
  const name = user.firstName || user.email.split("@")[0];
  const unread = await unreadCount(user.id);

  if (user.role === "STUDENT") return <StudentHome user={user} unread={unread} name={name} />;
  return <StaffHome role={user.role} name={name} unread={unread} />;
}

async function StudentHome({
  user,
  unread,
  name,
}: {
  user: { id: string; groupId: string | null; profileCompleted: boolean; group: { name: string } | null };
  unread: number;
  name: string;
}) {
  const upcoming = user.groupId
    ? await prisma.event.findMany({
        where: { date: { gte: new Date(new Date().toDateString()) }, groups: { some: { groupId: user.groupId } } },
        orderBy: { date: "asc" },
        take: 5,
      })
    : [];

  return (
    <>
      <PageHeader title={`Cześć, ${name}!`} subtitle="Twój panel podopiecznego Slavic Fight." />

      {!user.profileCompleted && (
        <div className="card mb-6 flex flex-wrap items-center justify-between gap-3 border-blood/40 p-4">
          <p className="text-sm text-chalk">Uzupełnij profil i wybierz grupę treningową, aby zobaczyć swój terminarz.</p>
          <Link href="/dashboard/profil" className="btn-primary btn-sm">Uzupełnij profil</Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Twoja grupa" value={user.group?.name ?? "—"} />
        <StatCard label="Nadchodzące zajęcia" value={upcoming.length} />
        <StatCard label="Nieprzeczytane" value={unread} hint="wiadomości" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="heading-display text-xl">Najbliższe zajęcia</h2>
            <Link href="/dashboard/terminarz" className="text-sm text-smoke hover:text-chalk">Wszystkie →</Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="text-sm text-smoke">Brak zaplanowanych zajęć dla Twojej grupy.</p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((e) => (
                <li key={e.id} className="flex items-center justify-between border-b border-steel/60 pb-3 last:border-0">
                  <div>
                    <p className="font-semibold text-chalk">{e.title}</p>
                    <p className="text-xs text-smoke">{formatShortDate(e.date)} · {e.startTime}–{e.endTime} · {e.location}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-6">
          <h2 className="heading-display text-xl">Szybkie akcje</h2>
          <div className="mt-4 flex flex-col gap-2">
            <Link href="/dashboard/wiadomosci" className="btn-outline justify-between">
              Napisz do trenera {unread > 0 && <Badge tone="alert">{unread}</Badge>}
            </Link>
            <Link href="/dashboard/terminarz" className="btn-outline">Zobacz terminarz</Link>
            <Link href="/dashboard/profil" className="btn-outline">Edytuj profil</Link>
          </div>
        </div>
      </div>
    </>
  );
}

async function StaffHome({ role, name, unread }: { role: string; name: string; unread: number }) {
  const today = new Date(new Date().toDateString());
  const [students, groups, upcoming, newContacts] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.group.count(),
    prisma.event.count({ where: { date: { gte: today } } }),
    prisma.contactSubmission.count({ where: { status: "NEW" } }),
  ]);

  const recentContacts = await prisma.contactSubmission.findMany({
    where: { status: "NEW" },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <>
      <PageHeader
        title={`Panel ${role === "SUPER_ADMIN" ? "administratora" : "trenera"}`}
        subtitle={`Witaj, ${name}.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Podopieczni" value={students} />
        <StatCard label="Grupy" value={groups} />
        <StatCard label="Nadchodzące zajęcia" value={upcoming} />
        <StatCard label="Nowe zgłoszenia" value={newContacts} hint="z formularza kontakt" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="heading-display text-xl">Nowe zgłoszenia kontaktowe</h2>
          {recentContacts.length === 0 ? (
            <p className="mt-4 text-sm text-smoke">Brak nowych zgłoszeń.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {recentContacts.map((c) => (
                <li key={c.id} className="border-b border-steel/60 pb-3 last:border-0">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-chalk">{c.name}</p>
                    <span className="text-xs text-smoke">{formatShortDate(c.createdAt)}</span>
                  </div>
                  <p className="text-xs text-smoke">{c.phone}{c.email ? ` · ${c.email}` : ""}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-smoke">{c.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-6">
          <h2 className="heading-display text-xl">Szybkie akcje</h2>
          <div className="mt-4 grid gap-2">
            <Link href="/dashboard/grupy" className="btn-outline">Zarządzaj grupami</Link>
            <Link href="/dashboard/terminarz" className="btn-outline">Dodaj wydarzenie</Link>
            <Link href="/dashboard/wiadomosci" className="btn-outline justify-between">
              Wiadomości {unread > 0 && <Badge tone="alert">{unread}</Badge>}
            </Link>
            <Link href="/dashboard/aktualnosci" className="btn-outline">Dodaj treść / video</Link>
            {role === "SUPER_ADMIN" && (
              <Link href="/dashboard/uzytkownicy" className="btn-outline">Zarządzaj użytkownikami</Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
