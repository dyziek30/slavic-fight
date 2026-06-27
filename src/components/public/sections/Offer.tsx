const OFFERS = [
  {
    title: "Boks dla początkujących",
    desc: "Podstawy techniki, praca nóg, gardy i ciosów. Bezpieczne wejście w świat boksu bez wcześniejszego doświadczenia.",
    points: ["Technika od zera", "Kondycja ogólna", "Praca na worku i łapach"],
  },
  {
    title: "Grupa zaawansowana",
    desc: "Sparingi, taktyka walki, praca nad wytrzymałością i szybkością. Dla osób z bazą bokserską.",
    points: ["Sparingi", "Taktyka i strategia", "Przygotowanie startowe"],
  },
  {
    title: "Treningi indywidualne",
    desc: "Personalny plan i pełna uwaga trenera. Najszybsza droga do progresu i korekty błędów.",
    points: ["Plan szyty na miarę", "Indywidualny feedback", "Elastyczne terminy"],
  },
  {
    title: "Boks dla dzieci i młodzieży",
    desc: "Rozwój sprawności, dyscypliny i pewności siebie w bezpiecznej, kontrolowanej formie.",
    points: ["Koordynacja", "Dyscyplina", "Pewność siebie"],
  },
];

export function Offer() {
  return (
    <section id="oferta" className="border-t border-steel/60 py-20">
      <div className="container-x">
        <header className="max-w-2xl">
          <span className="label">Oferta</span>
          <h2 className="heading-display text-3xl sm:text-4xl">Treningi dla każdego poziomu</h2>
          <p className="mt-3 text-smoke">
            Wybierz formę dopasowaną do swoich celów. Każdy zaczyna w innym miejscu — liczy się
            kierunek.
          </p>
        </header>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {OFFERS.map((o) => (
            <article key={o.title} className="card flex flex-col p-6 transition-colors hover:border-ash">
              <h3 className="heading-display text-xl text-chalk">{o.title}</h3>
              <p className="mt-2 flex-1 text-sm text-smoke">{o.desc}</p>
              <ul className="mt-4 space-y-1.5 text-sm text-smoke">
                {o.points.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-chalk" />
                    {p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
