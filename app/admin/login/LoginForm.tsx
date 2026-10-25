"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";

const MESSAGES: Record<string, string> = {
  wrong: "Wrong email or password.",
  locked: "Too many attempts. Wait a minute and try again.",
  not_configured: "Set ADMIN_SESSION_SECRET and ADMIN_PASSWORD in the environment to enable the dashboard.",
};

export default function LoginForm() {
  const [error, action, pending] = useActionState(loginAction, null);
  const field = "w-full rounded-lg border border-line bg-surface px-4 py-3 outline-none focus:border-gold";
  return (
    <form action={action} className="mt-8 space-y-4">
      <label className="block text-sm">
        Email
        <input name="email" type="email" autoComplete="username" className={`${field} mt-1`} dir="ltr" />
      </label>
      <label className="block text-sm">
        Password
        <input name="password" type="password" required autoComplete="current-password" className={`${field} mt-1`} dir="ltr" />
      </label>
      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {MESSAGES[error] ?? "Sign-in failed."}
        </p>
      ) : null}
      <button disabled={pending} className="w-full rounded-full bg-gold py-3 font-medium text-on-gold disabled:opacity-60">
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
