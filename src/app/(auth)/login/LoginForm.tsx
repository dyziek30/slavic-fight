"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type AuthState } from "@/app/actions/auth";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const [state, action] = useActionState<AuthState, FormData>(loginAction, {});

  return (
    <div className="panel p-8">
      <h1 className="heading-display text-2xl">Zaloguj się</h1>
      <p className="mt-1 text-sm text-smoke">Wejdź do panelu Slavic Fight.</p>

      <form action={action} className="mt-6 space-y-4">
        {redirectTo && <input type="hidden" name="redirect" value={redirectTo} />}
        {state.error && (
          <p className="rounded-md border border-blood/40 bg-blood/10 px-3 py-2 text-sm text-chalk">
            {state.error}
          </p>
        )}
        <div>
          <label className="label" htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" autoComplete="email" className="input" required />
          {state.fieldErrors?.email && <p className="field-error">{state.fieldErrors.email[0]}</p>}
        </div>
        <div>
          <label className="label" htmlFor="password">Hasło</label>
          <input id="password" name="password" type="password" autoComplete="current-password" className="input" required />
          {state.fieldErrors?.password && <p className="field-error">{state.fieldErrors.password[0]}</p>}
        </div>
        <SubmitButton pendingText="Logowanie…">Zaloguj się</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-smoke">
        Nie masz konta?{" "}
        <Link href="/rejestracja" className="font-semibold text-chalk hover:underline">
          Zarejestruj się
        </Link>
      </p>
    </div>
  );
}
