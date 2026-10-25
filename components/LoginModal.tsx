"use client";

import Link from "next/link";
import { LogIn, X } from "lucide-react";
import { useRef } from "react";
import LoginForm from "@/components/LoginForm";
import { dict, type Lang } from "@/lib/i18n";

/** Navbar login button that opens the sign-in form in a native dialog (focus trap and Esc come for free). */
export default function LoginModal({ lang }: { lang: Lang }) {
  const t = dict[lang].login;
  const ref = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        className="inline-flex h-9 items-center gap-2 rounded-full bg-gold px-4 text-sm font-medium text-on-gold transition-transform hover:-translate-y-0.5"
      >
        <LogIn size={16} aria-hidden />
        {t.title}
      </button>

      <dialog
        ref={ref}
        aria-labelledby="login-modal-title"
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="m-auto w-[min(92vw,24rem)] rounded-2xl border border-line bg-bg p-6 text-fg backdrop:bg-black/50"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="login-modal-title" className="font-display text-3xl font-medium">
              {t.title}
            </h2>
            <p className="mt-1 text-sm text-muted">{t.hint}</p>
          </div>
          <button
            type="button"
            aria-label={t.close}
            onClick={() => ref.current?.close()}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-line hover:border-gold"
          >
            <X size={16} />
          </button>
        </div>
        <LoginForm lang={lang} />
        <Link href="/login" className="mt-4 block text-center text-sm text-muted underline underline-offset-4 hover:text-fg">
          {t.page}
        </Link>
      </dialog>
    </>
  );
}
