import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { youtubeId } from "@/lib/utils";

export async function AcademyPreview() {
  let posts: {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    type: string;
    coverImage: string | null;
    videoUrl: string | null;
  }[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { published: true, type: { in: ["VIDEO", "BLOG"] } },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 3,
    });
  } catch {
    /* baza niedostępna */
  }

  if (posts.length === 0) return null;

  return (
    <section id="akademia" className="border-t border-steel/60 py-20">
      <div className="container-x">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="label">Akademia Video / Blog</span>
            <h2 className="heading-display text-3xl sm:text-4xl">Ucz się boksu online</h2>
            <p className="mt-3 text-smoke">Technika, porady i wiedza prosto od trenera.</p>
          </div>
          <Link href="/akademia" className="btn-outline btn-sm">Zobacz wszystko</Link>
        </header>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
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
                    <Image src={thumb} alt={p.title} fill className="object-cover opacity-90 transition-opacity group-hover:opacity-100" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-4xl text-ash">🥊</div>
                  )}
                  <span className="badge absolute left-3 top-3 bg-ink/80 text-chalk">
                    {p.type === "VIDEO" ? "Video" : "Blog"}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-chalk group-hover:underline">{p.title}</h3>
                  {p.excerpt && <p className="mt-2 line-clamp-2 text-sm text-smoke">{p.excerpt}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
