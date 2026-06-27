import Link from "next/link";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader, Badge } from "@/components/dashboard/ui";
import { initials } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PodopieczniPage({
  searchParams,
}: {
  searchParams: Promise<{ group?: string }>;
}) {
  await requireRole("TRAINER", "SUPER_ADMIN");
  const { group } = await searchParams;

  const [groups, students] = await Promise.all([
    prisma.group.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { members: true } } } }),
    prisma.user.findMany({
      where: {
        role: "STUDENT",
        ...(group === "none" ? { groupId: null } : group ? { groupId: group } : {}),
      },
      orderBy: [{ lastName: "asc" }, { createdAt: "desc" }],
      include: { group: { select: { name: true } } },
    }),
  ]);

  const chip = (href: string, label: string, active: boolean, count?: number) => (
    <Link
      href={href}
      className={cn("nav-link border border-steel", active && "nav-link-active border-ash")}
    >
      {label}
      {count !== undefined && <span className="ml-1 text-smoke">({count})</span>}
    </Link>
  );

  return (
    <>
      <PageHeader title="Podopieczni" subtitle="Lista podopiecznych z możliwością filtrowania po grupach." />

      <div className="mb-6 flex flex-wrap gap-2">
        {chip("/dashboard/podopieczni", "Wszyscy", !group)}
        {groups.map((g) =>
          chip(`/dashboard/podopieczni?group=${g.id}`, g.name, group === g.id, g._count.members),
        )}
        {chip("/dashboard/podopieczni?group=none", "Bez grupy", group === "none")}
      </div>

      {students.length === 0 ? (
        <div className="card p-10 text-center text-smoke">Brak podopiecznych w tym widoku.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-steel text-left text-xs uppercase tracking-wide text-smoke">
              <tr>
                <th className="p-4">Podopieczny</th>
                <th className="p-4">Kontakt</th>
                <th className="hidden p-4 sm:table-cell">Rok ur.</th>
                <th className="p-4">Grupa</th>
                <th className="p-4 text-right">Akcje</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-steel/40 last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                        {initials(s.firstName, s.lastName, s.email)}
                      </span>
                      <div>
                        <p className="font-semibold text-chalk">
                          {[s.firstName, s.lastName].filter(Boolean).join(" ") || "—"}
                        </p>
                        <p className="text-xs text-smoke">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-smoke">{s.phone ?? "—"}</td>
                  <td className="hidden p-4 text-smoke sm:table-cell">{s.birthYear ?? "—"}</td>
                  <td className="p-4">
                    {s.group ? <Badge tone="muted">{s.group.name}</Badge> : <span className="text-smoke">—</span>}
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/dashboard/wiadomosci/new?to=${s.id}`} className="btn-ghost btn-sm">
                      Napisz
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
