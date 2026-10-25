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
  const field = "mt-1 w-full rounded-lg border border-line bg-surface px-4 py-3 outline-none focus:border-gold";

  return (
    <form action={action} className="mt-6 space-y-4">
      <label className="block text-sm">
        {t.email}
        <input name="email" type="email" required autoComplete="username" className={field} dir="ltr" />
      </label>
      <label className="block text-sm">
        {t.password}
        <input name="password" type="password" required autoComplete="current-password" className={field} dir="ltr" />
      </label>
      {error ? (
        <p role="alert" className="text-sm text-red-600">
          {messages[error] ?? t.failed}
        </p>
      ) : null}
      <button disabled={pending} className="w-full rounded-full bg-gold py-3 font-medium text-on-gold disabled:opacity-60">
        {pending ? t.pending : t.submit}
      </button>
    </form>
  );
}
