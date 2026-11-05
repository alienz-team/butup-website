"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Search, ShoppingBag, Sun, X } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useCart } from "@/components/CartProvider";
import LoginModal from "@/components/LoginModal";
import { LANG_COOKIE, LOGO_URL, THEME_COOKIE, dict, type Lang, type Theme } from "@/lib/i18n";

const YEAR = 60 * 60 * 24 * 365;
const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=${YEAR}; samesite=lax`;
};

export default function Navbar({ lang, theme }: { lang: Lang; theme: Theme }) {
  const t = dict[lang];
  const router = useRouter();
  const { count, openCart } = useCart();
  const [, startTransition] = useTransition();
  const [menu, setMenu] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searching) searchRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearching(false);
        setMenu(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [searching]);

  const switchLang = () => {
    setCookie(LANG_COOKIE, lang === "ar" ? "en" : "ar");
    startTransition(() => router.refresh());
  };

  const switchTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    setCookie(THEME_COOKIE, next);
    startTransition(() => router.refresh());
  };

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") ?? "").trim();
    setSearching(false);
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : "/shop");
  };

  const links = [
    { href: "/shop", label: t.nav.shop },
    { href: "/#categories", label: t.nav.categories },
    { href: "/#story", label: t.nav.story },
    { href: "#contact", label: t.nav.contact },
  ];
  const iconBtn = "relative grid size-10 place-items-center transition-opacity hover:opacity-60";

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-glass backdrop-blur-xl">
      <div className="mx-auto grid h-16 max-w-[1500px] grid-cols-[1fr_auto_1fr] items-center px-5 md:h-[72px] md:px-10">
        <div className="flex items-center gap-8">
          <button type="button" className={`${iconBtn} md:hidden`} aria-label={t.nav.menu} aria-expanded={menu} onClick={() => setMenu(true)}>
            <Menu size={20} strokeWidth={1.25} />
          </button>
          <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="underline-link pb-0.5 text-[13px] tracking-wide">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        <Link href="/" className="logo-chip" aria-label={t.brand}>
          <Image src={LOGO_URL} alt={t.brand} width={56} height={46} unoptimized priority className="h-9 w-auto md:h-10" />
        </Link>

        <div className="flex items-center justify-end gap-0.5 md:gap-1">
          <button type="button" className={iconBtn} aria-label={t.nav.search} onClick={() => setSearching(true)}>
            <Search size={19} strokeWidth={1.25} />
          </button>
          <button type="button" onClick={switchLang} className="hidden h-10 px-3 text-[13px] transition-opacity hover:opacity-60 md:block">
            {t.toggles.lang}
          </button>
          <button
            type="button"
            onClick={switchTheme}
            aria-label={theme === "dark" ? t.toggles.toLight : t.toggles.toDark}
            className={`${iconBtn} hidden md:grid`}
          >
            {theme === "dark" ? <Sun size={18} strokeWidth={1.25} /> : <Moon size={18} strokeWidth={1.25} />}
          </button>
          <div className="hidden ps-2 md:block">
            <LoginModal lang={lang} />
          </div>
          <button type="button" className={iconBtn} aria-label={`${t.nav.cart} (${count})`} onClick={openCart}>
            <ShoppingBag size={19} strokeWidth={1.25} />
            {count > 0 ? (
              <span className="absolute end-1 top-1.5 grid min-w-4 place-items-center rounded-full bg-fg px-1 text-[10px] leading-4 text-bg tabular-nums">
                {count}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searching ? (
          <motion.form
            onSubmit={onSearch}
            role="search"
            className="absolute inset-x-0 top-full border-b border-line bg-bg"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="mx-auto flex max-w-[1500px] items-center gap-4 px-5 py-5 md:px-10">
              <Search size={20} strokeWidth={1.25} aria-hidden />
              <input ref={searchRef} name="q" type="search" placeholder={dict[lang].shop.searchPlaceholder} className="display flex-1 bg-transparent text-2xl outline-none placeholder:text-muted md:text-4xl" />
              <button type="button" aria-label={dict[lang].shop.close} onClick={() => setSearching(false)} className={iconBtn}>
                <X size={20} strokeWidth={1.25} />
              </button>
            </div>
          </motion.form>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {menu ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div className="absolute inset-0 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMenu(false)} aria-hidden />
            <motion.div
              className="absolute inset-y-0 start-0 flex w-[82%] max-w-sm flex-col bg-bg px-7 py-6"
              initial={{ x: lang === "ar" ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: lang === "ar" ? "100%" : "-100%" }}
              transition={{ type: "tween", ease: [0.22, 0.8, 0.2, 1], duration: 0.45 }}
            >
              <button type="button" className={`${iconBtn} -ms-2 self-start`} aria-label={dict[lang].shop.close} onClick={() => setMenu(false)}>
                <X size={22} strokeWidth={1.25} />
              </button>
              <nav className="mt-8 flex flex-col gap-5">
                {links.map((l) => (
                  <Link key={l.href} href={l.href} onClick={() => setMenu(false)} className="display text-4xl">
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-line pt-6 text-sm">
                <button type="button" onClick={switchLang} className="border border-line px-4 py-2">
                  {t.toggles.lang}
                </button>
                <button type="button" onClick={switchTheme} className="border border-line px-4 py-2">
                  {theme === "dark" ? t.toggles.toLight : t.toggles.toDark}
                </button>
                <Link href="/login" onClick={() => setMenu(false)} className="bg-fg px-5 py-2 text-bg">
                  {t.nav.login}
                </Link>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
