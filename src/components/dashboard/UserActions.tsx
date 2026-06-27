"use client";

import { useActionState, useState } from "react";
import {
  changeUserRole,
  resetUserPassword,
  toggleUserActive,
  deleteUser,
  type AdminState,
} from "@/app/actions/admin";
import { Modal } from "@/components/ui/Modal";
import { SubmitButton } from "@/components/ui/SubmitButton";

export type UserDTO = {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "TRAINER" | "STUDENT";
  active: boolean;
};

export function UserActions({ user, isSelf }: { user: UserDTO; isSelf: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="btn-ghost btn-sm" onClick={() => setOpen(true)}>Zarządzaj</button>
      {open && <UserModal user={user} isSelf={isSelf} onClose={() => setOpen(false)} />}
    </>
  );
}

function UserModal({ user, isSelf, onClose }: { user: UserDTO; isSelf: boolean; onClose: () => void }) {
  const [roleState, roleAction] = useActionState<AdminState, FormData>(changeUserRole, {});
  const [pwState, pwAction] = useActionState<AdminState, FormData>(resetUserPassword, {});

  return (
    <Modal open onClose={onClose} title={`Konto: ${user.name}`}>
      <p className="mb-4 text-sm text-smoke">{user.email}</p>

      {/* Zmiana roli */}
      <form action={roleAction} className="card mb-4 space-y-3 p-4">
        <input type="hidden" name="userId" value={user.id} />
        <label className="label">Rola</label>
        <select name="role" className="input" defaultValue={user.role} disabled={isSelf}>
          <option value="STUDENT">Podopieczny</option>
          <option value="TRAINER">Trener</option>
          <option value="SUPER_ADMIN">Administrator</option>
        </select>
        {isSelf && <p className="text-xs text-smoke">Nie możesz zmienić własnej roli.</p>}
        {roleState.error && <p className="field-error">{roleState.error}</p>}
        {roleState.info && <p className="text-xs text-chalk">{roleState.info}</p>}
        {!isSelf && <SubmitButton className="btn-outline" pendingText="…">Zapisz rolę</SubmitButton>}
      </form>

      {/* Reset hasła */}
      <form action={pwAction} className="card mb-4 space-y-3 p-4">
        <input type="hidden" name="userId" value={user.id} />
        <label className="label">Nowe hasło</label>
        <input name="newPassword" type="text" className="input" placeholder="min. 8 znaków" minLength={8} required />
        {pwState.error && <p className="field-error">{pwState.error}</p>}
        {pwState.info && <p className="text-xs text-chalk">{pwState.info}</p>}
        <SubmitButton className="btn-outline" pendingText="…">Resetuj hasło</SubmitButton>
      </form>

      {/* Akcje */}
      {!isSelf && (
        <div className="flex gap-2">
          <form action={toggleUserActive} className="flex-1">
            <input type="hidden" name="userId" value={user.id} />
            <button type="submit" className="btn-ghost btn-sm w-full">
              {user.active ? "Zablokuj konto" : "Odblokuj konto"}
            </button>
          </form>
          <form
            action={deleteUser}
            className="flex-1"
            onSubmit={(e) => { if (!confirm(`Usunąć konto ${user.email}? Tej operacji nie można cofnąć.`)) e.preventDefault(); }}
          >
            <input type="hidden" name="userId" value={user.id} />
            <button type="submit" className="btn-danger btn-sm w-full">Usuń konto</button>
          </form>
        </div>
      )}
    </Modal>
  );
}
