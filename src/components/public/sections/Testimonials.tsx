import { prisma } from "@/lib/prisma";

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Ocena ${n} na 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < n ? "text-chalk" : "text-ash"}>
          ★
        </span>
      ))}
    </div>
  );
}

export async function Testimonials() {
  let items: { id: string; author: string; role: string | null; content: string; rating: number }[] = [];
  try {
    items = await prisma.testimonial.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
  } catch {
    /* baza niedostępna */
  }

  if (items.length === 0) return null;

  return (
    <section id="opinie" className="border-t border-steel/60 py-20">
      <div className="container-x">
        <header className="max-w-2xl">
          <span className="label">Opinie</span>
          <h2 className="heading-display text-3xl sm:text-4xl">Co mówią podopieczni</h2>
        </header>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <figure key={t.id} className="card flex flex-col p-6">
              <Stars n={t.rating} />
              <blockquote className="mt-4 flex-1 text-sm text-chalk/90">„{t.content}”</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-chalk">{t.author}</span>
                {t.role && <span className="text-smoke"> · {t.role}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
