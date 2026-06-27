import type { Metadata } from "next";
import { ContactSection } from "@/components/public/sections/ContactSection";
import { Location } from "@/components/public/sections/Location";

export const metadata: Metadata = {
  title: "Kontakt — umów trening boksu w Buszkowicach",
  description:
    "Skontaktuj się ze Slavic Fight. Telefon, formularz, WhatsApp. Buszkowice 59A — boks Przemyśl, Żurawica.",
};

export default function KontaktPage() {
  return (
    <div className="pt-6">
      <ContactSection />
      <Location />
    </div>
  );
}
