import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/dashboard/ui";
import { PostManager, type PostDTO } from "@/components/dashboard/PostManager";

export const dynamic = "force-dynamic";

export default async function AktualnosciPage() {
  await requireRole("TRAINER", "SUPER_ADMIN");

  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  const dto: PostDTO[] = posts.map((p) => ({
    id: p.id,
    type: p.type as PostDTO["type"],
    title: p.title,
    excerpt: p.excerpt,
    content: p.content,
    coverImage: p.coverImage,
    videoUrl: p.videoUrl,
    published: p.published,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <>
      <PageHeader title="Treści / Akademia" subtitle="Aktualności, wpisy blogowe i materiały video." />
      <PostManager posts={dto} />
    </>
  );
}
