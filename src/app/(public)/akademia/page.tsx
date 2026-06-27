import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { youtubeId, formatShortDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Akademia Video i Blog — boks od podstaw",
  description:
    "Materiały wideo i artykuły o boksie od trenera Slavic Fight. Technika, taktyka i porady treningowe.",
};

export const dynamic = "force-dynamic";

export default async function AkademiaPage() {
  let posts: Awaited<ReturnType<typeof prisma.post.findMany>> = [];
  try {
    posts = await prisma.post.findMany({
      where: { published: true, type: { in: ["VIDEO", "BLOG"] } },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
  } catch {
    /* baza niedostępna */
  }

  return (
    <div className="container-x py-16">
      <header className="max-w-2xl">
        <span className="label">Akademia</span>
        <h1 className="heading-display text-4xl">Akademia Video / Blog</h1>
        <p className="mt-3 text-smoke">Wiedza, technika i porady prosto od trenera.</p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-12 text-smoke">Materiały pojawią się wkrótce.</p>
      ) : (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => {
            const yt = youtubeId(p.videoUrl);
            const thumb = p.coverImage || (yt ? `https://img.youtube.com/vi/${yt}/hqdefault.jpg` : null);
            return (
              <Link
                key={p.id}
                href={`/akademia/${p.slug}`}
                className="card group overflow-hidden transition-colors hover:border-ash"
              >
                <div className="relative aspect-video bg-graphite">
                  {thumb ? (
                    <Image src={thumb} alt={p.title} fill className="object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl text-ash">🥊</div>
                  )}
                  <span className="badge absolute left-3 top-3 bg-ink/80 text-chalk">
                    {p.type === "VIDEO" ? "Video" : "Blog"}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs text-smoke">{formatShortDate(p.publishedAt ?? p.createdAt)}</p>
                  <h2 className="mt-1 font-semibold text-chalk group-hover:underline">{p.title}</h2>
                  {p.excerpt && <p className="mt-2 line-clamp-2 text-sm text-smoke">{p.excerpt}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
