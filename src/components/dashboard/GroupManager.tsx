"use client";

import { useActionState, useEffect, useState } from "react";
import { createGroup, updateGroup, deleteGroup, type GroupState } from "@/app/actions/groups";
import { Modal } from "@/components/ui/Modal";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Badge } from "@/components/dashboard/ui";

export type GroupDTO = {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  memberCount: number;
};

export function GroupManager({ groups }: { groups: GroupDTO[] }) {
  const [editing, setEditing] = useState<GroupDTO | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button className="btn-primary btn-sm" onClick={() => setCreating(true)}>+ Nowa grupa</button>
      </div>

      {groups.length === 0 ? (
        <div className="card p-10 text-center text-smoke">Brak grup. Utwórz pierwszą grupę treningową.</div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {groups.map((g) => (
            <div key={g.id} className="card p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="heading-display text-lg text-chalk">{g.name}</h3>
                  <p className="text-xs text-smoke">{g.memberCount} podopiecznych</p>
                </div>
                <Badge tone={g.active ? "ok" : "muted"}>{g.active ? "Aktywna" : "Nieaktywna"}</Badge>
              </div>
              {g.description && <p className="mt-2 text-sm text-smoke">{g.description}</p>}
              <div className="mt-4 flex gap-2">
                <button className="btn-ghost btn-sm" onClick={() => setEditing(g)}>Edytuj</button>
                <form
                  action={deleteGroup}
                  onSubmit={(e) => {
                    if (!confirm(`Usunąć grupę „${g.name}”? Podopieczni zostaną odpięci.`)) e.preventDefault();
                  }}
                >
                  <input type="hidden" name="id" value={g.id} />
                  <button className="btn-danger btn-sm" type="submit">Usuń</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {creating && (
        <GroupModal title="Nowa grupa" onClose={() => setCreating(false)} action={createGroup} />
      )}
      {editing && (
        <GroupModal title="Edytuj grupę" group={editing} onClose={() => setEditing(null)} action={updateGroup} />
      )}
    </>
  );
}

function GroupModal({
  title,
  group,
  onClose,
  action,
}: {
  title: string;
  group?: GroupDTO;
  onClose: () => void;
  action: (prev: GroupState, fd: FormData) => Promise<GroupState>;
}) {
  const [state, formAction] = useActionState<GroupState, FormData>(action, {});
  useEffect(() => {
    if (state.ok) onClose();
  }, [state.ok, onClose]);

  return (
    <Modal open onClose={onClose} title={title}>
      <form action={formAction} className="space-y-4">
        {group && <input type="hidden" name="id" value={group.id} />}
        {state.error && (
          <p className="rounded-md border border-blood/40 bg-blood/10 px-3 py-2 text-sm text-chalk">{state.error}</p>
        )}
        <div>
          <label className="label">Nazwa grupy</label>
          <input name="name" className="input" defaultValue={group?.name} required />
          {state.fieldErrors?.name && <p className="field-error">{state.fieldErrors.name[0]}</p>}
        </div>
        <div>
          <label className="label">Opis (opcjonalnie)</label>
          <textarea name="description" rows={3} className="input resize-none" defaultValue={group?.description ?? ""} />
        </div>
        <label className="flex items-center gap-2 text-sm text-chalk">
          <input type="checkbox" name="active" defaultChecked={group?.active ?? true} className="accent-white" />
          Grupa aktywna (widoczna przy wyborze przez podopiecznego)
        </label>
        <SubmitButton pendingText="Zapisywanie…">Zapisz</SubmitButton>
      </form>
    </Modal>
  );
}
