import { ContactForm } from "@/components/public/ContactForm";
import { SITE } from "@/lib/constants";

export function ContactSection() {
  return (
    <section id="kontakt" className="border-t border-steel/60 py-20">
      <div className="container-x grid gap-10 lg:grid-cols-2">
        <div>
          <span className="label">Kontakt</span>
          <h2 className="heading-display text-3xl sm:text-4xl">Umów pierwszy trening</h2>
          <p className="mt-3 max-w-md text-smoke">
            Zostaw kontakt, a oddzwonimy i ustalimy termin. Możesz też napisać bezpośrednio na
            WhatsApp lub zadzwonić.
          </p>

          <div className="mt-8 space-y-3">
            <a href={`tel:${SITE.phone}`} className="card flex items-center gap-4 p-4 hover:border-ash">
              <span className="text-2xl">📞</span>
              <div>
                <p className="text-xs uppercase tracking-wide text-smoke">Zadzwoń</p>
                <p className="font-semibold text-chalk">{SITE.phone}</p>
              </div>
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card flex items-center gap-4 p-4 hover:border-ash"
            >
              <span className="text-2xl">💬</span>
              <div>
                <p className="text-xs uppercase tracking-wide text-smoke">WhatsApp</p>
                <p className="font-semibold text-chalk">Napisz wiadomość</p>
              </div>
            </a>
            <div className="card flex items-center gap-4 p-4">
              <span className="text-2xl">📍</span>
              <div>
                <p className="text-xs uppercase tracking-wide text-smoke">Adres</p>
                <p className="font-semibold text-chalk">
                  {SITE.address.street}, {SITE.address.postalCode} {SITE.address.city}
                </p>
              </div>
            </div>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
