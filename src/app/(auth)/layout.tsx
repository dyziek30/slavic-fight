import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="container-x flex h-16 items-center">
        <Logo />
      </header>
      <main className="container-x flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <footer className="container-x py-6 text-center text-xs text-smoke/70">
        <Link href="/" className="hover:text-chalk">← Wróć na stronę główną</Link>
      </footer>
    </div>
  );
}
