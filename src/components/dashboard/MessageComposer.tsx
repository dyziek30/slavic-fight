"use client";

import { useActionState, useEffect, useRef } from "react";
import { replyMessage, messageTrainer, type MessageState } from "@/app/actions/messages";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function ReplyComposer({ conversationId }: { conversationId: string }) {
  const [state, action] = useActionState<MessageState, FormData>(replyMessage, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="flex items-end gap-2">
      <input type="hidden" name="conversationId" value={conversationId} />
      <div className="flex-1">
        <textarea
          name="body"
          rows={2}
          placeholder="Napisz wiadomość…"
          className="input resize-none"
          required
        />
        {state.fieldErrors?.body && <p className="field-error">{state.fieldErrors.body[0]}</p>}
        {state.error && <p className="field-error">{state.error}</p>}
      </div>
      <div className="w-32">
        <SubmitButton pendingText="…">Wyślij</SubmitButton>
      </div>
    </form>
  );
}

export function TrainerComposer() {
  const [state, action] = useActionState<MessageState, FormData>(messageTrainer, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form ref={formRef} action={action} className="card space-y-3 p-5">
      {state.ok && (
        <p className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-chalk">
          Wiadomość wysłana do trenera.
        </p>
      )}
      {state.error && (
        <p className="rounded-md border border-blood/40 bg-blood/10 px-3 py-2 text-sm text-chalk">{state.error}</p>
      )}
      <div>
        <label className="label">Wiadomość do trenera</label>
        <textarea name="body" rows={3} className="input resize-none" placeholder="W czym możemy pomóc?" required />
        {state.fieldErrors?.body && <p className="field-error">{state.fieldErrors.body[0]}</p>}
      </div>
      <SubmitButton pendingText="Wysyłanie…">Wyślij do trenera</SubmitButton>
    </form>
  );
}
