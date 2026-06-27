import { Hero } from "@/components/public/sections/Hero";
import { Offer } from "@/components/public/sections/Offer";
import { GeneralSchedule } from "@/components/public/sections/GeneralSchedule";
import { TrainerSection } from "@/components/public/sections/TrainerSection";
import { AcademyPreview } from "@/components/public/sections/AcademyPreview";
import { Testimonials } from "@/components/public/sections/Testimonials";
import { Faq } from "@/components/public/sections/Faq";
import { Location } from "@/components/public/sections/Location";
import { ContactSection } from "@/components/public/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Offer />
      <GeneralSchedule teaser />
      <TrainerSection />
      <AcademyPreview />
      <Testimonials />
      <Faq />
      <Location />
      <ContactSection />
    </>
  );
}
