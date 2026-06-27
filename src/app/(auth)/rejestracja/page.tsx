import type { Metadata } from "next";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = { title: "Rejestracja", robots: { index: false } };

export default function RegisterPage() {
  return <RegisterForm />;
}
