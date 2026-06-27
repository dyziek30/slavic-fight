import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/constants";

export function TrainerSection() {
  return (
    <section id="trener" className="border-t border-steel/60 py-20">
      <div className="container-x grid items-center gap-12 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <span className="label">Trener</span>
          <h2 className="heading-display text-3xl sm:text-4xl">{SITE.trainer}</h2>
          <p className="mt-4 text-smoke">
            Założyciel i trener Slavic Fight. Boks to dla niego nie tylko sport, ale sposób na
            budowanie charakteru, dyscypliny i pewności siebie. Prowadzi treningi w Buszkowicach,
            pracując zarówno z osobami stawiającymi pierwsze kroki, jak i z zawodnikami
            przygotowującymi się do walk.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-smoke">
            <li className="flex gap-3">
              <span className="heading-display text-chalk">01</span>
              Indywidualne podejście do każdego podopiecznego
            </li>
            <li className="flex gap-3">
              <span className="heading-display text-chalk">02</span>
              Nacisk na poprawną technikę i bezpieczeństwo
            </li>
            <li className="flex gap-3">
              <span className="heading-display text-chalk">03</span>
              Budowanie kondycji, siły i mentalności wojownika
            </li>
          </ul>
          <div className="mt-8 flex gap-3">
            <Link href="/trener" className="btn-outline">Poznaj trenera</Link>
            <Link href="/kontakt" className="btn-primary">Umów trening</Link>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="relative mx-auto max-w-sm">
            <div className="absolute -inset-3 -z-10 rounded-2xl bg-white/5 blur-2xl" />
            <div className="overflow-hidden rounded-2xl border border-steel bg-carbon p-10">
              <Image
                src="/logo.jpg"
                alt={SITE.trainer}
                width={420}
                height={420}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
