import { requireRole } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { PageHeader, Badge } from "@/components/dashboard/ui";
import { saveSetting, updateContactStatus } from "@/app/actions/admin";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

const SETTINGS_FIELDS = [
  { key: "club_phone", label: "Telefon klubu" },
  { key: "club_whatsapp", label: "Numer WhatsApp (bez +)" },
  { key: "club_address", label: "Adres" },
  { key: "club_announcement", label: "Ogłoszenie na stronie głównej" },
];

const STATUS_LABEL: Record<string, string> = { NEW: "Nowe", CONTACTED: "Skontaktowano", ARCHIVED: "Archiwum" };

export default async function UstawieniaPage() {
  await requireRole("SUPER_ADMIN");

  const [settings, contacts] = await Promise.all([
    prisma.siteSetting.findMany(),
    prisma.contactSubmission.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
  ]);
  const map = new Map(settings.map((s) => [s.key, s.value]));

  return (
    <>
      <PageHeader title="Ustawienia" subtitle="Konfiguracja strony i moderacja zgłoszeń." />

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-smoke">Dane i treści strony</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {SETTINGS_FIELDS.map((f) => (
            <form key={f.key} action={saveSetting} className="card space-y-2 p-4">
              <input type="hidden" name="key" value={f.key} />
              <label className="label">{f.label}</label>
              <div className="flex gap-2">
                <input name="value" className="input" defaultValue={map.get(f.key) ?? ""} />
                <button type="submit" className="btn-outline btn-sm">Zapisz</button>
              </div>
            </form>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-smoke">
          Zgłoszenia z formularza kontaktowego
        </h2>
        {contacts.length === 0 ? (
          <div className="card p-8 text-center text-smoke">Brak zgłoszeń.</div>
        ) : (
          <div className="space-y-3">
            {contacts.map((c) => (
              <div key={c.id} className="card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-chalk">{c.name}</p>
                    <p className="text-xs text-smoke">
                      {c.phone}{c.email ? ` · ${c.email}` : ""} · {formatDateTime(c.createdAt)}
                    </p>
                  </div>
                  <Badge tone={c.status === "NEW" ? "alert" : c.status === "ARCHIVED" ? "muted" : "ok"}>
                    {STATUS_LABEL[c.status]}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-smoke">{c.message}</p>
                <form action={updateContactStatus} className="mt-3 flex items-center gap-2">
                  <input type="hidden" name="id" value={c.id} />
                  <select name="status" defaultValue={c.status} className="input max-w-[180px] py-1.5 text-xs">
                    <option value="NEW">Nowe</option>
                    <option value="CONTACTED">Skontaktowano</option>
                    <option value="ARCHIVED">Archiwum</option>
                  </select>
                  <button type="submit" className="btn-ghost btn-sm">Aktualizuj</button>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
