import type { Metadata } from "next";
import { GeneralSchedule } from "@/components/public/sections/GeneralSchedule";

export const metadata: Metadata = {
  title: "Grafik zajęć — boks Buszkowice, Przemyśl, Żurawica",
  description:
    "Plan treningów bokserskich Slavic Fight w Buszkowicach. Sprawdź dni i godziny zajęć dla początkujących, zaawansowanych oraz dzieci.",
};

export default function GrafikPage() {
  return (
    <div className="pt-6">
      <GeneralSchedule />
    </div>
  );
}
