import Link from "next/link";
import Image from "next/image";
import { SITE } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-graphite/40 via-ink to-ink" />
      <div className="container-x grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
        <div className="animate-fade-up">
          <span className="badge bg-white/10 text-chalk">
            Boks · Przemyśl · Żurawica · Buszkowice
          </span>
          <h1 className="heading-display mt-5 text-4xl leading-[0.95] sm:text-6xl">
            Zostań silniejszy
            <span className="block text-smoke">z Slavic Fight</span>
          </h1>
          <p className="mt-6 max-w-md text-base text-smoke">
            Profesjonalne treningi bokserskie pod okiem {SITE.trainer}. Technika, kondycja i
            charakter — dla początkujących i zaawansowanych. {SITE.address.street}.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/kontakt" className="btn-primary">
              Umów pierwszy trening
            </Link>
            <Link href="/rejestracja" className="btn-outline">
              Dołącz do Slavic Fight
            </Link>
          </div>

          <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-steel pt-6">
            <div>
              <dt className="heading-display text-3xl text-chalk">100%</dt>
              <dd className="text-xs uppercase tracking-wide text-smoke">Zaangażowania</dd>
            </div>
            <div>
              <dt className="heading-display text-3xl text-chalk">3</dt>
              <dd className="text-xs uppercase tracking-wide text-smoke">Grupy poziomów</dd>
            </div>
            <div>
              <dt className="heading-display text-3xl text-chalk">7+</dt>
              <dd className="text-xs uppercase tracking-wide text-smoke">Lat doświadczenia</dd>
            </div>
          </dl>
        </div>

        <div className="relative animate-fade-up">
          <div className="absolute -inset-4 -z-10 rounded-full bg-white/5 blur-3xl" />
          <div className="mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-steel bg-carbon p-8 shadow-2xl shadow-black/60">
            <Image
              src="/logo.jpg"
              alt="Slavic Fight"
              width={520}
              height={520}
              className="h-full w-full object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
