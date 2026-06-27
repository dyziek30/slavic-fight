"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/session";
import { postSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";

export type PostState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

async function uniqueSlug(title: string, ignoreId?: string): Promise<string> {
  const base = slugify(title) || "wpis";
  let slug = base;
  let n = 1;
  while (true) {
    const existing = await prisma.post.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${base}-${++n}`;
  }
}

function parse(formData: FormData) {
  return postSchema.safeParse({
    type: formData.get("type"),
    title: formData.get("title"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImage: formData.get("coverImage"),
    videoUrl: formData.get("videoUrl"),
    published: formData.get("published") === "on" || formData.get("published") === "true",
  });
}

export async function createPost(_prev: PostState, formData: FormData): Promise<PostState> {
  const user = await requireRole("TRAINER", "SUPER_ADMIN");
  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: "Sprawdź formularz", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;

  await prisma.post.create({
    data: {
      type: d.type,
      title: d.title,
      slug: await uniqueSlug(d.title),
      excerpt: d.excerpt || null,
      content: d.content,
      coverImage: d.coverImage || null,
      videoUrl: d.videoUrl || null,
      published: d.published,
      publishedAt: d.published ? new Date() : null,
      authorId: user.id,
    },
  });

  revalidatePath("/dashboard/aktualnosci");
  revalidatePath("/akademia");
  return { ok: true };
}

export async function updatePost(_prev: PostState, formData: FormData): Promise<PostState> {
  await requireRole("TRAINER", "SUPER_ADMIN");
  const id = formData.get("id") as string;
  if (!id) return { error: "Brak identyfikatora wpisu" };

  const parsed = parse(formData);
  if (!parsed.success) {
    return { error: "Sprawdź formularz", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const d = parsed.data;
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return { error: "Wpis nie istnieje" };

  await prisma.post.update({
    where: { id },
    data: {
      type: d.type,
      title: d.title,
      slug: await uniqueSlug(d.title, id),
      excerpt: d.excerpt || null,
      content: d.content,
      coverImage: d.coverImage || null,
      videoUrl: d.videoUrl || null,
      published: d.published,
      publishedAt: d.published ? existing.publishedAt ?? new Date() : null,
    },
  });

  revalidatePath("/dashboard/aktualnosci");
  revalidatePath("/akademia");
  return { ok: true };
}

export async function deletePost(formData: FormData): Promise<void> {
  await requireRole("TRAINER", "SUPER_ADMIN");
  const id = formData.get("id") as string;
  if (!id) return;
  await prisma.post.delete({ where: { id } });
  revalidatePath("/dashboard/aktualnosci");
  revalidatePath("/akademia");
}
