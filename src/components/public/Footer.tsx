import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { SITE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-steel/60 bg-carbon">
      <div className="container-x grid gap-10 py-14 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-smoke">
            Sekcja bokserska {SITE.trainer}. Treningi dla każdego — od pierwszych kroków po
            sparingi. {SITE.address.street}.
          </p>
        </div>

        <div>
          <h3 className="label">Nawigacja</h3>
          <ul className="space-y-2 text-sm text-smoke">
            <li><Link href="/#oferta" className="hover:text-chalk">Oferta treningów</Link></li>
            <li><Link href="/grafik" className="hover:text-chalk">Grafik zajęć</Link></li>
            <li><Link href="/trener" className="hover:text-chalk">Trener</Link></li>
            <li><Link href="/akademia" className="hover:text-chalk">Akademia Video</Link></li>
            <li><Link href="/kontakt" className="hover:text-chalk">Kontakt</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="label">Kontakt</h3>
          <ul className="space-y-2 text-sm text-smoke">
            <li>{SITE.address.street}, {SITE.address.postalCode} {SITE.address.city}</li>
            <li>
              <a href={`tel:${SITE.phone}`} className="hover:text-chalk">{SITE.phone}</a>
            </li>
            <li>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-chalk"
              >
                WhatsApp
              </a>
            </li>
          </ul>
          <p className="mt-4 text-xs text-smoke/70">
            Obszar: {SITE.areasServed.join(" · ")}
          </p>
        </div>
      </div>

      <div className="border-t border-steel/60">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-smoke/70 sm:flex-row">
          <p>© {new Date().getFullYear()} {SITE.name}. Wszelkie prawa zastrzeżone.</p>
          <p>Boks Przemyśl · Żurawica · Buszkowice</p>
        </div>
      </div>
    </footer>
  );
}
