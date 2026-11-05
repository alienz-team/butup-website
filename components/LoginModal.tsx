"use client";

import Link from "next/link";
import { X } from "lucide-react";
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
        className="h-9 bg-fg px-5 text-[13px] text-bg transition-opacity hover:opacity-80"
      >
        {dict[lang].nav.login}
      </button>

      <dialog
        ref={ref}
        aria-labelledby="login-modal-title"
        onClick={(e) => e.target === ref.current && ref.current?.close()}
        className="m-auto w-[min(92vw,26rem)] border border-line bg-bg p-8 text-fg backdrop:bg-black/50"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="login-modal-title" className="display text-4xl">
              {t.title}
            </h2>
            <p className="mt-2 text-sm text-muted">{t.hint}</p>
          </div>
          <button type="button" aria-label={t.close} onClick={() => ref.current?.close()} className="grid size-9 shrink-0 place-items-center">
            <X size={18} strokeWidth={1.25} />
          </button>
        </div>
        <LoginForm lang={lang} />
        <Link href="/login" className="underline-link mx-auto mt-5 block w-fit pb-0.5 text-sm text-muted">
          {t.page}
        </Link>
      </dialog>
    </>
  );
}
