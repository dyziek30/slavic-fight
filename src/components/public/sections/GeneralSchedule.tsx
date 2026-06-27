import Link from "next/link";

// Ogólny grafik publiczny (poglądowy). Spersonalizowany terminarz grupowy
// dostępny jest dla zalogowanych podopiecznych w panelu.
const SCHEDULE = [
  { day: "Poniedziałek", slots: ["18:00–19:30 · Początkujący", "19:30–21:00 · Zaawansowani"] },
  { day: "Wtorek", slots: ["17:00–18:00 · Dzieci i młodzież"] },
  { day: "Środa", slots: ["18:00–19:30 · Początkujący", "19:30–21:00 · Zaawansowani"] },
  { day: "Czwartek", slots: ["17:00–18:00 · Dzieci i młodzież"] },
  { day: "Piątek", slots: ["18:00–20:00 · Sparingi (open)"] },
  { day: "Sobota", slots: ["10:00–11:30 · Trening ogólny"] },
  { day: "Niedziela", slots: ["—"] },
];

export function GeneralSchedule({ teaser = false }: { teaser?: boolean }) {
  return (
    <section id="grafik" className="border-t border-steel/60 py-20">
      <div className="container-x">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="label">Grafik ogólny</span>
            <h2 className="heading-display text-3xl sm:text-4xl">Plan zajęć w tygodniu</h2>
            <p className="mt-3 text-smoke">
              Poglądowy rozkład treningów. Po zalogowaniu zobaczysz terminarz dopasowany do
              swojej grupy.
            </p>
          </div>
          {teaser && (
            <Link href="/grafik" className="btn-outline btn-sm">
              Pełny grafik
            </Link>
          )}
        </header>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(teaser ? SCHEDULE.slice(0, 4) : SCHEDULE).map((d) => (
            <div key={d.day} className="card p-5">
              <h3 className="heading-display text-lg text-chalk">{d.day}</h3>
              <ul className="mt-3 space-y-2">
                {d.slots.map((s) => (
                  <li key={s} className="text-sm text-smoke">{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
