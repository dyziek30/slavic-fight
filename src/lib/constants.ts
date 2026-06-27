// Stałe danych klubu — używane w SEO, schema.org, stopce i sekcji kontakt.

export const SITE = {
  name: "Slavic Fight",
  tagline: "Sekcja bokserska Tomasza Artyma",
  description:
    "Profesjonalne treningi bokserskie w Buszkowicach koło Przemyśla. Trener Tomasz Artym. Boks dla początkujących i zaawansowanych — Przemyśl, Żurawica, Buszkowice.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  trainer: "Tomasz Artym",
  address: {
    street: "Buszkowice 59A",
    city: "Buszkowice",
    region: "podkarpackie",
    postalCode: "37-710",
    country: "PL",
  },
  geo: { lat: 49.8226, lng: 22.8447 },
  phone: process.env.NEXT_PUBLIC_PHONE ?? "+48000000000",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP ?? "48000000000",
  areasServed: ["Przemyśl", "Żurawica", "Buszkowice", "Orzechowce", "Bolestraszyce"],
  keywords: [
    "boks Przemyśl",
    "boks Żurawica",
    "trener boksu Tomasz Artym",
    "treningi bokserskie Buszkowice",
    "Slavic Fight",
    "sekcja bokserska Przemyśl",
  ],
} as const;

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Administrator",
  TRAINER: "Trener",
  STUDENT: "Podopieczny",
};
