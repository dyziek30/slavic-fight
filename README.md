# Slavic Fight 🥊

Aplikacja webowa sekcji bokserskiej **Tomasza Artyma** (Buszkowice / Przemyśl / Żurawica) — strona marketingowa + portal dla podopiecznych, trenera i administratora.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · PostgreSQL · Prisma 6 · własna autoryzacja (bcrypt + JWT w httpOnly cookie, `jose`) · Zod.

## Wymagania

- Node.js 18.18+ (zalecane 20+)
- Działający serwer PostgreSQL

## Uruchomienie

```bash
# 1. Zależności
npm install

# 2. Konfiguracja środowiska
cp .env.example .env
#   uzupełnij DATABASE_URL, AUTH_SECRET (openssl rand -base64 32),
#   NEXT_PUBLIC_PHONE, NEXT_PUBLIC_WHATSAPP

# 3. Baza danych
npm run db:push      # utwórz schemat w bazie
npm run db:seed      # dane przykładowe + konta testowe

# 4. Start
npm run dev          # http://localhost:3000
```

## Konta testowe (po `db:seed`)

| Rola | E-mail | Hasło |
|---|---|---|
| SUPER_ADMIN | `admin@slavicfight.pl` | `Admin123!` |
| TRAINER | `tomasz@slavicfight.pl` | `Trener123!` |
| STUDENT | `jan@example.com` | `Haslo123!` |

## Struktura

```
prisma/
  schema.prisma      # modele bazy danych
  seed.ts            # dane przykładowe
src/
  app/
    (public)/        # strona marketingowa (Hero, oferta, grafik, trener, akademia, kontakt)
    (auth)/          # logowanie / rejestracja
    dashboard/       # portal: profil, terminarz, wiadomości, grupy, podopieczni, treści, użytkownicy, ustawienia
    actions/         # Server Actions (auth, profil, grupy, wydarzenia, wiadomości, treści, admin, kontakt)
    sitemap.ts robots.ts
  components/
    public/  dashboard/  ui/
  lib/
    prisma.ts auth.ts jwt.ts session.ts validation.ts messaging.ts constants.ts utils.ts
  middleware.ts      # ochrona tras wg ról (edge)
```

## Bezpieczeństwo

- Hasła hashowane bcryptem (12 rund).
- Sesja: podpisany JWT (HS256) w cookie `httpOnly`, `sameSite=lax`, `secure` w produkcji.
- Trójwarstwowa ochrona: `middleware.ts` (edge) → `requireRole()` (widoki) → walidacja roli/własności w każdej Server Action.
- Walidacja wejścia: Zod (klient + serwer).
- Podopieczny nie ma dostępu do danych innych podopiecznych ani cudzych rozmów; SUPER_ADMIN ma podgląd moderacyjny.

## Skrypty

| Komenda | Opis |
|---|---|
| `npm run dev` | serwer deweloperski |
| `npm run build` | build produkcyjny (`prisma generate` + `next build`) |
| `npm run db:push` | synchronizacja schematu z bazą |
| `npm run db:migrate` | migracje deweloperskie |
| `npm run db:seed` | dane przykładowe |
| `npm run db:studio` | Prisma Studio |
