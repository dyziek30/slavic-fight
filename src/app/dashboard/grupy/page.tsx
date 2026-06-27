import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/ui";
import { GroupManager, type GroupDTO } from "@/components/dashboard/GroupManager";

export const dynamic = "force-dynamic";

export default async function GrupyPage() {
  await requireRole("TRAINER", "SUPER_ADMIN");

  const groups = await prisma.group.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { members: true } } },
  });

  const dto: GroupDTO[] = groups.map((g) => ({
    id: g.id,
    name: g.name,
    description: g.description,
    active: g.active,
    memberCount: g._count.members,
  }));

  return (
    <>
      <PageHeader title="Grupy treningowe" subtitle="Twórz i zarządzaj grupami podopiecznych." />
      <GroupManager groups={dto} />
    </>
  );
}
