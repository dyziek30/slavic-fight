import { SITE } from "@/lib/constants";

export function Location() {
  const q = encodeURIComponent(`${SITE.address.street}, ${SITE.address.city}`);
  return (
    <section id="lokalizacja" className="border-t border-steel/60 py-20">
      <div className="container-x grid gap-10 lg:grid-cols-2">
        <div>
          <span className="label">Lokalizacja</span>
          <h2 className="heading-display text-3xl sm:text-4xl">Trenuj w Buszkowicach</h2>
          <p className="mt-3 text-smoke">
            Znajdziesz nas pod adresem <strong className="text-chalk">{SITE.address.street}</strong>,
            {" "}{SITE.address.postalCode} {SITE.address.city} — kilka minut od Przemyśla i Żurawicy.
          </p>
          <ul className="mt-6 space-y-2 text-sm text-smoke">
            <li>📍 {SITE.address.street}, {SITE.address.postalCode} {SITE.address.city}</li>
            <li>📞 <a href={`tel:${SITE.phone}`} className="hover:text-chalk">{SITE.phone}</a></li>
            <li>
              💬{" "}
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-chalk"
              >
                Napisz na WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div className="overflow-hidden rounded-2xl border border-steel">
          <iframe
            title="Mapa — Slavic Fight Buszkowice"
            src={`https://www.google.com/maps?q=${q}&output=embed`}
            className="h-72 w-full grayscale lg:h-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
