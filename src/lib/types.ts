// Współdzielone uniony ról/typów. Trzymane po stronie aplikacji (zamiast enumów
// Prisma), dzięki czemu schemat działa zarówno na SQLite (dev), jak i PostgreSQL.
// Walidację wartości zapewnia Zod oraz logika Server Actions.

export type Role = "SUPER_ADMIN" | "TRAINER" | "STUDENT";
export type PostType = "NEWS" | "VIDEO" | "BLOG";
export type ContactStatus = "NEW" | "CONTACTED" | "ARCHIVED";

export const ROLES: Role[] = ["SUPER_ADMIN", "TRAINER", "STUDENT"];
