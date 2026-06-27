"use client";

import { useActionState, useEffect, useState } from "react";
import { createEvent, updateEvent, deleteEvent, type EventState } from "@/app/actions/events";
import { Modal } from "@/components/ui/Modal";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Badge } from "@/components/dashboard/ui";
import { formatShortDate } from "@/lib/utils";

export type EventDTO = {
  id: string;
  title: string;
  description: string | null;
  date: string; // ISO (yyyy-mm-dd)
  startTime: string;
  endTime: string;
  location: string;
  groupIds: string[];
  groupNames: string[];
};

type Group = { id: string; name: string };

export function EventManager({ events, groups }: { events: EventDTO[]; groups: Group[] }) {
  const [editing, setEditing] = useState<EventDTO | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button className="btn-primary btn-sm" onClick={() => setCreating(true)} disabled={groups.length === 0}>
          + Nowe wydarzenie
        </button>
      </div>
      {groups.length === 0 && (
        <p className="mb-4 text-sm text-smoke">Najpierw utwórz grupę, aby dodać wydarzenie.</p>
      )}

      {events.length === 0 ? (
        <div className="card p-10 text-center text-smoke">Brak wydarzeń w terminarzu.</div>
      ) : (
        <div className="space-y-3">
          {events.map((e) => (
            <div key={e.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold text-chalk">{e.title}</p>
                <p className="text-xs text-smoke">
                  {formatShortDate(e.date)} · {e.startTime}–{e.endTime} · {e.location}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {e.groupNames.map((n) => (
                    <Badge key={n} tone="muted">{n}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="btn-ghost btn-sm" onClick={() => setEditing(e)}>Edytuj</button>
                <form action={deleteEvent}>
                  <input type="hidden" name="id" value={e.id} />
                  <button className="btn-danger btn-sm" type="submit">Usuń</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {creating && (
        <EventModal title="Nowe wydarzenie" groups={groups} onClose={() => setCreating(false)} action={createEvent} />
      )}
      {editing && (
        <EventModal title="Edytuj wydarzenie" groups={groups} event={editing} onClose={() => setEditing(null)} action={updateEvent} />
      )}
    </>
  );
}

function EventModal({
  title,
  groups,
  event,
  onClose,
  action,
}: {
  title: string;
  groups: Group[];
  event?: EventDTO;
  onClose: () => void;
  action: (prev: EventState, fd: FormData) => Promise<EventState>;
}) {
  const [state, formAction] = useActionState<EventState, FormData>(action, {});
  useEffect(() => {
    if (state.ok) onClose();
  }, [state.ok, onClose]);

  return (
    <Modal open onClose={onClose} title={title}>
      <form action={formAction} className="space-y-4">
        {event && <input type="hidden" name="id" value={event.id} />}
        {state.error && (
          <p className="rounded-md border border-blood/40 bg-blood/10 px-3 py-2 text-sm text-chalk">{state.error}</p>
        )}
        <div>
          <label className="label">Tytuł</label>
          <input name="title" className="input" defaultValue={event?.title} required />
          {state.fieldErrors?.title && <p className="field-error">{state.fieldErrors.title[0]}</p>}
        </div>
        <div>
          <label className="label">Opis (opcjonalnie)</label>
          <textarea name="description" rows={2} className="input resize-none" defaultValue={event?.description ?? ""} />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="label">Data</label>
            <input name="date" type="date" className="input" defaultValue={event?.date} required />
            {state.fieldErrors?.date && <p className="field-error">{state.fieldErrors.date[0]}</p>}
          </div>
          <div>
            <label className="label">Od</label>
            <input name="startTime" type="time" className="input" defaultValue={event?.startTime ?? "18:00"} required />
          </div>
          <div>
            <label className="label">Do</label>
            <input name="endTime" type="time" className="input" defaultValue={event?.endTime ?? "19:30"} required />
          </div>
        </div>
        <div>
          <label className="label">Lokalizacja</label>
          <input name="location" className="input" defaultValue={event?.location ?? "Buszkowice 59A"} required />
        </div>
        <div>
          <label className="label">Grupy</label>
          <div className="grid max-h-40 gap-1 overflow-y-auto rounded-md border border-ash bg-coal p-3 sm:grid-cols-2">
            {groups.map((g) => (
              <label key={g.id} className="flex items-center gap-2 text-sm text-chalk">
                <input
                  type="checkbox"
                  name="groupIds"
                  value={g.id}
                  defaultChecked={event?.groupIds.includes(g.id)}
                  className="accent-white"
                />
                {g.name}
              </label>
            ))}
          </div>
          {state.fieldErrors?.groupIds && <p className="field-error">{state.fieldErrors.groupIds[0]}</p>}
        </div>
        <SubmitButton pendingText="Zapisywanie…">Zapisz</SubmitButton>
      </form>
    </Modal>
  );
}
