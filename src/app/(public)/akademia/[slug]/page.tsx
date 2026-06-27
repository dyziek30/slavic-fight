import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { youtubeId, formatDate } from "@/lib/utils";

async function getPost(slug: string) {
  try {
    return await prisma.post.findFirst({
      where: { slug, published: true },
      include: { author: { select: { firstName: true, lastName: true } } },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Nie znaleziono" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: { title: post.title, description: post.excerpt ?? undefined },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const yt = youtubeId(post.videoUrl);

  return (
    <article className="container-x max-w-3xl py-16">
      <Link href="/akademia" className="text-sm text-smoke hover:text-chalk">
        ← Wróć do Akademii
      </Link>
      <span className="badge mt-6 bg-white/10 text-chalk">
        {post.type === "VIDEO" ? "Video" : post.type === "BLOG" ? "Blog" : "Aktualność"}
      </span>
      <h1 className="heading-display mt-4 text-4xl leading-tight">{post.title}</h1>
      <p className="mt-3 text-sm text-smoke">
        {formatDate(post.publishedAt ?? post.createdAt)}
        {post.author?.firstName && ` · ${post.author.firstName} ${post.author.lastName ?? ""}`}
      </p>

      {yt && (
        <div className="mt-8 aspect-video overflow-hidden rounded-xl border border-steel">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${yt}`}
            title={post.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {!yt && post.coverImage && (
        <div className="relative mt-8 aspect-video overflow-hidden rounded-xl border border-steel">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <div className="prose prose-invert mt-8 max-w-none whitespace-pre-wrap text-chalk/90">
        {post.content}
      </div>
    </article>
  );
}
