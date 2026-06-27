import { Sidebar } from "@/components/dashboard/Sidebar";
import { requireUser } from "@/lib/session";
import { unreadCount } from "@/lib/messaging";
import type { Role } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const unread = await unreadCount(user.id);
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email.split("@")[0];

  return (
    <div className="lg:flex">
      <Sidebar role={user.role as Role} unread={unread} name={name} email={user.email} />
      <div className="min-w-0 flex-1">
        <div className="container-x py-8">{children}</div>
      </div>
    </div>
  );
}
