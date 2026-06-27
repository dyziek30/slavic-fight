"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

const LINKS = [
  { href: "/#oferta", label: "Oferta" },
  { href: "/grafik", label: "Grafik" },
  { href: "/trener", label: "Trener" },
  { href: "/akademia", label: "Akademia" },
  { href: "/#opinie", label: "Opinie" },
  { href: "/#faq", label: "FAQ" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Navbar({ isAuthed }: { isAuthed: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-steel/60 bg-ink/85 backdrop-blur-md">
      <nav className="container-x flex h-16 items-center justify-between">
        <Logo />

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="nav-link">
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {isAuthed ? (
            <Link href="/dashboard" className="btn-primary btn-sm">
              Mój panel
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn-outline btn-sm">
                Zaloguj się
              </Link>
              <Link href="/kontakt" className="btn-primary btn-sm">
                Umów trening
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-md p-2 text-chalk lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-steel/60 bg-carbon lg:hidden">
          <div className="container-x flex flex-col gap-1 py-4">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="nav-link"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-3 flex gap-2">
              {isAuthed ? (
                <Link href="/dashboard" className="btn-primary btn-sm flex-1">
                  Mój panel
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn-outline btn-sm flex-1">
                    Zaloguj
                  </Link>
                  <Link href="/kontakt" className="btn-primary btn-sm flex-1">
                    Umów trening
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
