"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "@/app/actions/profile";
import { SubmitButton } from "@/components/ui/SubmitButton";

type Group = { id: string; name: string };
type Defaults = {
  firstName: string;
  lastName: string;
  birthYear: string;
  phone: string;
  groupId: string;
};

export function ProfileForm({
  groups,
  defaults,
  isStudent,
}: {
  groups: Group[];
  defaults: Defaults;
  isStudent: boolean;
}) {
  const [state, action] = useActionState<ProfileState, FormData>(updateProfile, {});

  return (
    <form action={action} className="panel max-w-xl space-y-4 p-6">
      {state.ok && (
        <p className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-chalk">
          Profil zapisany.
        </p>
      )}
      {state.error && (
        <p className="rounded-md border border-blood/40 bg-blood/10 px-3 py-2 text-sm text-chalk">
          {state.error}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="firstName">Imię</label>
          <input id="firstName" name="firstName" className="input" defaultValue={defaults.firstName} required />
          {state.fieldErrors?.firstName && <p className="field-error">{state.fieldErrors.firstName[0]}</p>}
        </div>
        <div>
          <label className="label" htmlFor="lastName">Nazwisko</label>
          <input id="lastName" name="lastName" className="input" defaultValue={defaults.lastName} required />
          {state.fieldErrors?.lastName && <p className="field-error">{state.fieldErrors.lastName[0]}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="birthYear">Rok urodzenia</label>
          <input id="birthYear" name="birthYear" type="number" className="input" defaultValue={defaults.birthYear} required />
          {state.fieldErrors?.birthYear && <p className="field-error">{state.fieldErrors.birthYear[0]}</p>}
        </div>
        <div>
          <label className="label" htmlFor="phone">Telefon (opcjonalnie)</label>
          <input id="phone" name="phone" className="input" defaultValue={defaults.phone} />
          {state.fieldErrors?.phone && <p className="field-error">{state.fieldErrors.phone[0]}</p>}
        </div>
      </div>

      {isStudent && (
        <div>
          <label className="label" htmlFor="groupId">Grupa treningowa</label>
          <select id="groupId" name="groupId" className="input" defaultValue={defaults.groupId} required>
            <option value="">— wybierz grupę —</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>
          {state.fieldErrors?.groupId && <p className="field-error">{state.fieldErrors.groupId[0]}</p>}
          {groups.length === 0 && (
            <p className="mt-1 text-xs text-smoke">Brak aktywnych grup — skontaktuj się z trenerem.</p>
          )}
        </div>
      )}

      <SubmitButton pendingText="Zapisywanie…">Zapisz profil</SubmitButton>
    </form>
  );
}
