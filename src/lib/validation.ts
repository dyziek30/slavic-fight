import { z } from "zod";

const currentYear = new Date().getFullYear();

export const registerSchema = z
  .object({
    email: z.string().trim().toLowerCase().email("Podaj poprawny adres e-mail"),
    password: z.string().min(8, "Hasło musi mieć min. 8 znaków").max(72),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Podaj poprawny adres e-mail"),
  password: z.string().min(1, "Podaj hasło"),
});

export const profileSchema = z.object({
  firstName: z.string().trim().min(2, "Podaj imię").max(50),
  lastName: z.string().trim().min(2, "Podaj nazwisko").max(50),
  birthYear: z.coerce
    .number()
    .int()
    .min(1920, "Nieprawidłowy rok")
    .max(currentYear, "Nieprawidłowy rok"),
  phone: z
    .string()
    .trim()
    .regex(/^[+0-9\s-]{7,20}$/, "Nieprawidłowy numer telefonu")
    .optional()
    .or(z.literal("")),
  groupId: z.string().min(1, "Wybierz grupę treningową"),
});

export const groupSchema = z.object({
  name: z.string().trim().min(2, "Nazwa grupy jest wymagana").max(80),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  active: z.boolean().default(true),
});

export const eventSchema = z.object({
  title: z.string().trim().min(2, "Tytuł jest wymagany").max(120),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  date: z.coerce.date({ message: "Podaj datę" }),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:MM"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:MM"),
  location: z.string().trim().min(2).max(120).default("Buszkowice 59A"),
  groupIds: z.array(z.string()).min(1, "Wybierz co najmniej jedną grupę"),
});

export const messageSchema = z.object({
  body: z.string().trim().min(1, "Wiadomość nie może być pusta").max(2000),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Podaj imię i nazwisko").max(100),
  phone: z.string().trim().regex(/^[+0-9\s-]{7,20}$/, "Nieprawidłowy numer telefonu"),
  email: z.string().trim().toLowerCase().email().optional().or(z.literal("")),
  message: z.string().trim().min(5, "Napisz wiadomość").max(1500),
});

export const postSchema = z.object({
  type: z.enum(["NEWS", "VIDEO", "BLOG"]),
  title: z.string().trim().min(2, "Tytuł jest wymagany").max(160),
  excerpt: z.string().trim().max(300).optional().or(z.literal("")),
  content: z.string().trim().min(1, "Treść jest wymagana"),
  coverImage: z.string().trim().url().optional().or(z.literal("")),
  videoUrl: z.string().trim().url().optional().or(z.literal("")),
  published: z.boolean().default(false),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type GroupInput = z.infer<typeof groupSchema>;
export type EventInput = z.infer<typeof eventSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type PostInput = z.infer<typeof postSchema>;
