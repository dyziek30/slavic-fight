"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@/lib/types";
import { Logo } from "@/components/ui/Logo";
import { logoutAction } from "@/app/actions/auth";
import { ROLE_LABELS } from "@/lib/constants";
import { cn, initials } from "@/lib/utils";

type NavItem = { href: string; label: string; roles: Role[]; badge?: number };

function buildNav(unread: number): NavItem[] {
  return [
    { href: "/dashboard", label: "Pulpit", roles: ["STUDENT", "TRAINER", "SUPER_ADMIN"] },
    { href: "/dashboard/profil", label: "Mój profil", roles: ["STUDENT", "TRAINER", "SUPER_ADMIN"] },
    { href: "/dashboard/terminarz", label: "Terminarz", roles: ["STUDENT", "TRAINER", "SUPER_ADMIN"] },
    { href: "/dashboard/wiadomosci", label: "Wiadomości", roles: ["STUDENT", "TRAINER", "SUPER_ADMIN"], badge: unread },
    { href: "/dashboard/grupy", label: "Grupy", roles: ["TRAINER", "SUPER_ADMIN"] },
    { href: "/dashboard/podopieczni", label: "Podopieczni", roles: ["TRAINER", "SUPER_ADMIN"] },
    { href: "/dashboard/aktualnosci", label: "Treści / Akademia", roles: ["TRAINER", "SUPER_ADMIN"] },
    { href: "/dashboard/uzytkownicy", label: "Użytkownicy", roles: ["SUPER_ADMIN"] },
    { href: "/dashboard/ustawienia", label: "Ustawienia", roles: ["SUPER_ADMIN"] },
  ];
}

export function Sidebar({
  role,
  unread,
  name,
  email,
}: {
  role: Role;
  unread: number;
  name: string;
  email: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = buildNav(unread).filter((i) => i.roles.includes(role));

  const nav = (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setOpen(false)}
            className={cn("nav-link flex items-center justify-between", active && "nav-link-active")}
          >
            <span>{item.label}</span>
            {item.badge ? (
              <span className="badge bg-blood/80 text-chalk">{item.badge}</span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-steel bg-carbon p-4 lg:hidden">
        <Logo size={32} />
        <button className="rounded-md p-2 text-chalk" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
          </svg>
        </button>
      </div>

      <aside
        className={cn(
          "border-steel bg-carbon lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-64 lg:flex-col lg:border-r",
          open ? "block border-b" : "hidden lg:block",
        )}
      >
        <div className="hidden p-5 lg:block">
          <Logo size={36} />
        </div>

        <div className="flex items-center gap-3 border-y border-steel/60 p-4 lg:border-t-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-chalk">
            {initials(name.split(" ")[0], name.split(" ")[1], email)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-chalk">{name}</p>
            <p className="text-xs text-smoke">{ROLE_LABELS[role]}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">{nav}</div>

        <div className="border-t border-steel/60 p-4">
          <form action={logoutAction}>
            <button type="submit" className="btn-ghost btn-sm w-full">
              Wyloguj się
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
