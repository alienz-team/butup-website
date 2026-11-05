"use client";

import { useActionState } from "react";
import { loginAction } from "@/app/admin/actions";
import { dict, type Lang } from "@/lib/i18n";

export default function LoginForm({ lang }: { lang: Lang }) {
  const t = dict[lang].login;
  const [error, action, pending] = useActionState(loginAction, null);
  const messages: Record<string, string> = {
    wrong: t.wrong,
    locked: t.locked,
    not_configured: t.not_configured,
  };
  const field = "mt-1 w-full border-b border-line bg-transparent py-2 text-base outline-none focus:border-fg";

  return (
    <form action={action} className="mt-8 space-y-6">
      <label className="block text-sm text-muted">
        {t.email}
        <input name="email" type="email" required autoComplete="username" className={field} dir="ltr" />
      </label>
      <label className="block text-sm text-muted">
        {t.password}
        <input name="password" type="password" required autoComplete="current-password" className={field} dir="ltr" />
      </label>
      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {messages[error] ?? t.failed}
        </p>
      ) : null}
      <button disabled={pending} className="w-full bg-fg py-3.5 text-sm text-bg transition-opacity hover:opacity-85 disabled:opacity-50">
        {pending ? t.pending : t.submit}
      </button>
    </form>
  );
}
