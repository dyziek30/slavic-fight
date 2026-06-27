import type { Metadata } from "next";
import { TrainerSection } from "@/components/public/sections/TrainerSection";
import { ContactSection } from "@/components/public/sections/ContactSection";
import { PersonJsonLd } from "@/components/public/JsonLd";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: `${SITE.trainer} — trener boksu Przemyśl, Buszkowice`,
  description: `${SITE.trainer} — trener boksu i założyciel Slavic Fight. Treningi bokserskie w Buszkowicach koło Przemyśla i Żurawicy.`,
};

export default function TrenerPage() {
  return (
    <div className="pt-6">
      <PersonJsonLd />
      <TrainerSection />
      <ContactSection />
    </div>
  );
}
