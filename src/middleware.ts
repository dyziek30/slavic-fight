import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/jwt";

// Ochrona tras na brzegu (edge). Pełna autoryzacja per-rola odbywa się
// dodatkowo w warstwie serwerowej (requireRole) — to pierwsza linia obrony.

const TRAINER_AREA = ["/dashboard/grupy", "/dashboard/podopieczni", "/dashboard/aktualnosci"];
const ADMIN_AREA = ["/dashboard/uzytkownicy", "/dashboard/ustawienia"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;

  // Trasy chronione
  if (pathname.startsWith("/dashboard")) {
    if (!session) {
      const url = new URL("/login", req.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    const isAdmin = session.role === "SUPER_ADMIN";
    const isTrainer = session.role === "TRAINER";

    if (ADMIN_AREA.some((p) => pathname.startsWith(p)) && !isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (TRAINER_AREA.some((p) => pathname.startsWith(p)) && !(isAdmin || isTrainer)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Zalogowany użytkownik nie potrzebuje stron logowania/rejestracji
  if ((pathname === "/login" || pathname === "/rejestracja") && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/rejestracja"],
};
