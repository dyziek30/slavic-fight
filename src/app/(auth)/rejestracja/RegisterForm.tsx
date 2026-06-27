"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type AuthState } from "@/app/actions/auth";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function RegisterForm() {
  const [state, action] = useActionState<AuthState, FormData>(registerAction, {});

  return (
    <div className="panel p-8">
      <h1 className="heading-display text-2xl">Dołącz do Slavic Fight</h1>
      <p className="mt-1 text-sm text-smoke">Załóż konto podopiecznego. Profil uzupełnisz po zalogowaniu.</p>

      <form action={action} className="mt-6 space-y-4">
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
          <input id="password" name="password" type="password" autoComplete="new-password" className="input" required />
          {state.fieldErrors?.password && <p className="field-error">{state.fieldErrors.password[0]}</p>}
        </div>
        <div>
          <label className="label" htmlFor="confirmPassword">Powtórz hasło</label>
          <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" className="input" required />
          {state.fieldErrors?.confirmPassword && (
            <p className="field-error">{state.fieldErrors.confirmPassword[0]}</p>
          )}
        </div>
        <SubmitButton pendingText="Tworzenie konta…">Załóż konto</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-smoke">
        Masz już konto?{" "}
        <Link href="/login" className="font-semibold text-chalk hover:underline">
          Zaloguj się
        </Link>
      </p>
    </div>
  );
}
