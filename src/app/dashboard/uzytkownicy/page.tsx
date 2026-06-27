import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader, Badge, StatCard } from "@/components/dashboard/ui";
import { UserActions, type UserDTO } from "@/components/dashboard/UserActions";
import { ROLE_LABELS } from "@/lib/constants";
import { initials } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function UzytkownicyPage() {
  const me = await requireRole("SUPER_ADMIN");

  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "desc" }],
  });

  const counts = {
    SUPER_ADMIN: users.filter((u) => u.role === "SUPER_ADMIN").length,
    TRAINER: users.filter((u) => u.role === "TRAINER").length,
    STUDENT: users.filter((u) => u.role === "STUDENT").length,
  };

  return (
    <>
      <PageHeader title="Użytkownicy" subtitle="Pełne zarządzanie kontami, rolami i hasłami." />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard label="Administratorzy" value={counts.SUPER_ADMIN} />
        <StatCard label="Trenerzy" value={counts.TRAINER} />
        <StatCard label="Podopieczni" value={counts.STUDENT} />
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-steel text-left text-xs uppercase tracking-wide text-smoke">
            <tr>
              <th className="p-4">Użytkownik</th>
              <th className="p-4">Rola</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const name = [u.firstName, u.lastName].filter(Boolean).join(" ") || u.email.split("@")[0];
              const dto: UserDTO = { id: u.id, name, email: u.email, role: u.role as UserDTO["role"], active: u.active };
              return (
                <tr key={u.id} className="border-b border-steel/40 last:border-0">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-xs font-bold">
                        {initials(u.firstName, u.lastName, u.email)}
                      </span>
                      <div>
                        <p className="font-semibold text-chalk">
                          {name} {u.id === me.id && <span className="text-xs text-smoke">(Ty)</span>}
                        </p>
                        <p className="text-xs text-smoke">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge tone={u.role === "STUDENT" ? "muted" : "ok"}>{ROLE_LABELS[u.role]}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge tone={u.active ? "ok" : "alert"}>{u.active ? "Aktywne" : "Zablokowane"}</Badge>
                  </td>
                  <td className="p-4 text-right">
                    <UserActions user={dto} isSelf={u.id === me.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
