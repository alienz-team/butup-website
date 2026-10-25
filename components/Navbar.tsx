"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Moon, Sun } from "lucide-react";
import { useTransition } from "react";
import LoginModal from "@/components/LoginModal";
import { LANG_COOKIE, LOGO_URL, THEME_COOKIE, dict, type Lang, type Theme } from "@/lib/i18n";

const YEAR = 60 * 60 * 24 * 365;
const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=${YEAR}; samesite=lax`;
};

export default function Navbar({ lang, theme }: { lang: Lang; theme: Theme }) {
  const t = dict[lang];
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const switchLang = () => {
    setCookie(LANG_COOKIE, lang === "ar" ? "en" : "ar");
    startTransition(() => router.refresh());
  };

  const switchTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    // Flip the class immediately so the change feels instant; refresh then syncs the server render.
    document.documentElement.classList.toggle("dark", next === "dark");
    setCookie(THEME_COOKIE, next);
    startTransition(() => router.refresh());
  };

  const links = [
    { href: "/#categories", label: t.nav.categories },
    { href: "/#deals", label: t.nav.deals },
    { href: "/#story", label: t.nav.story },
    { href: "/#contact", label: t.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
        <Link href="/" className="logo-chip" aria-label={t.brand}>
          <Image src={LOGO_URL} alt={t.brand} width={56} height={46} unoptimized priority className="h-10 w-auto" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-muted transition-colors hover:text-fg">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2" aria-busy={pending}>
          <div className="hidden md:block">
            <LoginModal lang={lang} />
          </div>
          <Link
            href="/login"
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gold px-3 text-sm font-medium text-on-gold md:hidden"
          >
            <LogIn size={15} aria-hidden />
            {t.nav.login}
          </Link>
          <button
            type="button"
            onClick={switchLang}
            className="h-9 rounded-full border border-line px-4 text-sm transition-colors hover:border-gold"
          >
            {t.toggles.lang}
          </button>
          <button
            type="button"
            onClick={switchTheme}
            aria-label={theme === "dark" ? t.toggles.toLight : t.toggles.toDark}
            className="grid size-9 place-items-center rounded-full border border-line transition-colors hover:border-gold"
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
}
