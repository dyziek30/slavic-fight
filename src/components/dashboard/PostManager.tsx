"use client";

import { useActionState, useEffect, useState } from "react";
import { createPost, updatePost, deletePost, type PostState } from "@/app/actions/posts";
import { Modal } from "@/components/ui/Modal";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Badge } from "@/components/dashboard/ui";
import { formatShortDate } from "@/lib/utils";

export type PostDTO = {
  id: string;
  type: "NEWS" | "VIDEO" | "BLOG";
  title: string;
  excerpt: string | null;
  content: string;
  coverImage: string | null;
  videoUrl: string | null;
  published: boolean;
  createdAt: string;
};

const TYPE_LABEL: Record<PostDTO["type"], string> = { NEWS: "Aktualność", VIDEO: "Video", BLOG: "Blog" };

export function PostManager({ posts }: { posts: PostDTO[] }) {
  const [editing, setEditing] = useState<PostDTO | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <>
      <div className="mb-6 flex justify-end">
        <button className="btn-primary btn-sm" onClick={() => setCreating(true)}>+ Nowy wpis</button>
      </div>

      {posts.length === 0 ? (
        <div className="card p-10 text-center text-smoke">Brak treści. Dodaj aktualność, wpis blogowy lub video.</div>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge tone="muted">{TYPE_LABEL[p.type]}</Badge>
                  <Badge tone={p.published ? "ok" : "muted"}>{p.published ? "Opublikowany" : "Szkic"}</Badge>
                </div>
                <p className="mt-1 font-semibold text-chalk">{p.title}</p>
                <p className="text-xs text-smoke">{formatShortDate(p.createdAt)}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn-ghost btn-sm" onClick={() => setEditing(p)}>Edytuj</button>
                <form action={deletePost} onSubmit={(e) => { if (!confirm("Usunąć wpis?")) e.preventDefault(); }}>
                  <input type="hidden" name="id" value={p.id} />
                  <button className="btn-danger btn-sm" type="submit">Usuń</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}

      {creating && <PostModal title="Nowy wpis" onClose={() => setCreating(false)} action={createPost} />}
      {editing && <PostModal title="Edytuj wpis" post={editing} onClose={() => setEditing(null)} action={updatePost} />}
    </>
  );
}

function PostModal({
  title,
  post,
  onClose,
  action,
}: {
  title: string;
  post?: PostDTO;
  onClose: () => void;
  action: (prev: PostState, fd: FormData) => Promise<PostState>;
}) {
  const [state, formAction] = useActionState<PostState, FormData>(action, {});
  useEffect(() => {
    if (state.ok) onClose();
  }, [state.ok, onClose]);

  return (
    <Modal open onClose={onClose} title={title}>
      <form action={formAction} className="space-y-4">
        {post && <input type="hidden" name="id" value={post.id} />}
        {state.error && (
          <p className="rounded-md border border-blood/40 bg-blood/10 px-3 py-2 text-sm text-chalk">{state.error}</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Typ</label>
            <select name="type" className="input" defaultValue={post?.type ?? "NEWS"}>
              <option value="NEWS">Aktualność</option>
              <option value="BLOG">Blog</option>
              <option value="VIDEO">Video (Akademia)</option>
            </select>
          </div>
          <label className="flex items-end gap-2 pb-2 text-sm text-chalk">
            <input type="checkbox" name="published" defaultChecked={post?.published ?? false} className="accent-white" />
            Opublikowany
          </label>
        </div>
        <div>
          <label className="label">Tytuł</label>
          <input name="title" className="input" defaultValue={post?.title} required />
          {state.fieldErrors?.title && <p className="field-error">{state.fieldErrors.title[0]}</p>}
        </div>
        <div>
          <label className="label">Zajawka (opcjonalnie)</label>
          <input name="excerpt" className="input" defaultValue={post?.excerpt ?? ""} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Link video YouTube (opcjonalnie)</label>
            <input name="videoUrl" className="input" placeholder="https://youtu.be/…" defaultValue={post?.videoUrl ?? ""} />
            {state.fieldErrors?.videoUrl && <p className="field-error">{state.fieldErrors.videoUrl[0]}</p>}
          </div>
          <div>
            <label className="label">Obraz okładki URL (opcjonalnie)</label>
            <input name="coverImage" className="input" placeholder="https://…" defaultValue={post?.coverImage ?? ""} />
            {state.fieldErrors?.coverImage && <p className="field-error">{state.fieldErrors.coverImage[0]}</p>}
          </div>
        </div>
        <div>
          <label className="label">Treść</label>
          <textarea name="content" rows={6} className="input resize-none" defaultValue={post?.content} required />
          {state.fieldErrors?.content && <p className="field-error">{state.fieldErrors.content[0]}</p>}
        </div>
        <SubmitButton pendingText="Zapisywanie…">Zapisz</SubmitButton>
      </form>
    </Modal>
  );
}
