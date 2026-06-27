import { redirect } from "next/navigation";
import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getOrCreateConversation } from "@/lib/messaging";

export const dynamic = "force-dynamic";

// Trener/Admin rozpoczyna rozmowę z wybranym podopiecznym (?to=userId).
export default async function NewConversationPage({
  searchParams,
}: {
  searchParams: Promise<{ to?: string }>;
}) {
  const user = await requireRole("TRAINER", "SUPER_ADMIN");
  const { to } = await searchParams;
  if (!to) redirect("/dashboard/wiadomosci");

  const target = await prisma.user.findUnique({ where: { id: to } });
  if (!target || target.id === user.id) redirect("/dashboard/wiadomosci");

  const convo = await getOrCreateConversation(user.id, target.id);
  redirect(`/dashboard/wiadomosci/${convo.id}`);
}
