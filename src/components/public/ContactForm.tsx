"use client";

import { useActionState } from "react";
import { submitContact, type ActionState } from "@/app/actions/contact";
import { SubmitButton } from "@/components/ui/SubmitButton";

const initial: ActionState = {};

export function ContactForm() {
  const [state, action] = useActionState(submitContact, initial);

  if (state.ok) {
    return (
      <div className="card p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-2xl">
          ✓
        </div>
        <h3 className="heading-display text-xl text-chalk">Dziękujemy!</h3>
        <p className="mt-2 text-sm text-smoke">
          Wiadomość została wysłana. Odezwiemy się najszybciej jak to możliwe.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="card space-y-4 p-6 sm:p-8">
      {state.error && (
        <p className="rounded-md border border-blood/40 bg-blood/10 px-3 py-2 text-sm text-chalk">
          {state.error}
        </p>
      )}
      <div>
        <label className="label" htmlFor="name">Imię i nazwisko</label>
        <input id="name" name="name" className="input" placeholder="Jan Kowalski" required />
        {state.fieldErrors?.name && <p className="field-error">{state.fieldErrors.name[0]}</p>}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="phone">Telefon</label>
          <input id="phone" name="phone" className="input" placeholder="600 000 000" required />
          {state.fieldErrors?.phone && <p className="field-error">{state.fieldErrors.phone[0]}</p>}
        </div>
        <div>
          <label className="label" htmlFor="email">E-mail (opcjonalnie)</label>
          <input id="email" name="email" type="email" className="input" placeholder="jan@example.com" />
          {state.fieldErrors?.email && <p className="field-error">{state.fieldErrors.email[0]}</p>}
        </div>
      </div>
      <div>
        <label className="label" htmlFor="message">Wiadomość</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          className="input resize-none"
          placeholder="Chcę umówić pierwszy trening…"
          required
        />
        {state.fieldErrors?.message && <p className="field-error">{state.fieldErrors.message[0]}</p>}
      </div>
      <SubmitButton pendingText="Wysyłanie…">Wyślij zgłoszenie</SubmitButton>
    </form>
  );
}
