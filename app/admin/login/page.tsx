import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  return (
    <main className="grid min-h-dvh place-items-center px-4" dir="ltr" lang="en">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-4xl font-medium">Beautup admin</h1>
        <p className="mt-2 text-sm text-muted">Sign in to manage products, stock and orders.</p>
        <LoginForm />
      </div>
    </main>
  );
}
