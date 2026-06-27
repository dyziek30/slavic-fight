import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <Logo size={56} withText={false} />
      <div>
        <p className="heading-display text-6xl text-chalk">404</p>
        <p className="mt-2 text-smoke">Nie znaleziono tej strony.</p>
      </div>
      <Link href="/" className="btn-primary">Wróć na stronę główną</Link>
    </div>
  );
}
