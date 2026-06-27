import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { LocalBusinessJsonLd } from "@/components/public/JsonLd";
import { getSession } from "@/lib/session";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  return (
    <>
      <LocalBusinessJsonLd />
      <Navbar isAuthed={!!session} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
