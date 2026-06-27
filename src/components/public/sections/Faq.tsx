const FAQS = [
  {
    q: "Czy muszę mieć doświadczenie, żeby zacząć?",
    a: "Nie. Większość podopiecznych zaczyna od zera. Grupa początkująca jest dokładnie po to, by bezpiecznie wprowadzić Cię w technikę i kondycję.",
  },
  {
    q: "Co zabrać na pierwszy trening?",
    a: "Wygodny strój sportowy, obuwie na zmianę, butelkę wody i nastawienie do pracy. Rękawice i owijki możesz dokupić później — na start pomożemy dobrać sprzęt.",
  },
  {
    q: "Gdzie odbywają się treningi?",
    a: "Buszkowice 59A, niedaleko Przemyśla i Żurawicy. Dokładną lokalizację i dojazd znajdziesz w sekcji kontakt.",
  },
  {
    q: "Jak umówić pierwszy trening?",
    a: "Zadzwoń, napisz przez formularz lub WhatsApp. Ustalimy termin i grupę dopasowaną do Twojego poziomu.",
  },
  {
    q: "Czy prowadzicie treningi dla dzieci?",
    a: "Tak. Mamy zajęcia dla dzieci i młodzieży nastawione na sprawność, dyscyplinę i pewność siebie w bezpiecznej formie.",
  },
  {
    q: "Czy są treningi indywidualne?",
    a: "Tak. Treningi 1:1 z personalnym planem to najszybsza droga do progresu i korekty błędów technicznych.",
  },
];

export function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section id="faq" className="border-t border-steel/60 py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="container-x">
        <header className="max-w-2xl">
          <span className="label">FAQ</span>
          <h2 className="heading-display text-3xl sm:text-4xl">Najczęstsze pytania</h2>
        </header>

        <div className="mt-10 grid gap-3 lg:grid-cols-2">
          {FAQS.map((f) => (
            <details key={f.q} className="card group p-5 [&_summary]:cursor-pointer">
              <summary className="flex items-center justify-between gap-4 font-semibold text-chalk marker:content-['']">
                {f.q}
                <span className="text-smoke transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-smoke">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
