import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/ui";
import { ProfileForm } from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await requireUser();
  const isStudent = user.role === "STUDENT";

  const groups = isStudent
    ? await prisma.group.findMany({ where: { active: true }, orderBy: { name: "asc" }, select: { id: true, name: true } })
    : [];

  return (
    <>
      <PageHeader title="Mój profil" subtitle="Uzupełnij swoje dane i wybierz grupę treningową." />
      <ProfileForm
        groups={groups}
        isStudent={isStudent}
        defaults={{
          firstName: user.firstName ?? "",
          lastName: user.lastName ?? "",
          birthYear: user.birthYear?.toString() ?? "",
          phone: user.phone ?? "",
          groupId: user.groupId ?? "",
        }}
      />
    </>
  );
}
