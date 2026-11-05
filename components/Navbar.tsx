"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Moon, Phone, ShoppingCart, Sun, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { useCart } from "@/components/CartProvider";
import { pick, type CategoryDTO } from "@/lib/catalog";
import { CONTACT, LANG_COOKIE, LOGO_URL, THEME_COOKIE, dict, type Lang, type Theme } from "@/lib/i18n";

const YEAR = 60 * 60 * 24 * 365;
const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value}; path=/; max-age=${YEAR}; samesite=lax`;
};

/**
 * Site123 header: fixed black bar, 100px tall and 80px once scrolled. Logo on the start side, white
 * 14px menu with white dropdowns, magenta on hover, phone and cart on the end side.
 */
export default function Navbar({ lang, theme, categories }: { lang: Lang; theme: Theme; categories: CategoryDTO[] }) {
  const t = dict[lang];
  const router = useRouter();
  const pathname = usePathname();
  const { count, openCart } = useCart();
  const [, startTransition] = useTransition();
  const [scrolledY, setScrolledY] = useState(false);
  // Inside pages (category, product) start with the solid black bar; the home page starts transparent.
  const scrolled = scrolledY || pathname !== "/";
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolledY(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  const tops = categories.filter((c) => !c.parentId);
  const subs = (id: string) => categories.filter((c) => c.parentId === id);
  const startItems = tops.slice(0, 3);
  const endItems = tops.slice(3);
  const tone = scrolled ? "text-white" : "text-black";
  const link = `block px-[15px] py-2 text-[14px] tracking-[0.07em] transition-colors hover:text-accent ${tone}`;

  const Item = ({ c }: { c: CategoryDTO }) => (
    <li className="group relative">
      <Link href={`/category/${c.slug}`} className={link}>
        {pick(c, "name", lang)}
        {subs(c.id).length > 0 ? <span aria-hidden className="ms-1.5 inline-block size-0 border-x-[4px] border-t-[4px] border-x-transparent border-t-current align-middle" /> : null}
      </Link>
      {subs(c.id).length > 0 ? (
        <ul className="invisible absolute start-0 top-full z-50 min-w-[160px] border border-black/15 bg-white py-[5px] opacity-0 shadow-[0_6px_12px_rgba(0,0,0,0.175)] transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
          {subs(c.id).map((s) => (
            <li key={s.id}>
              <Link href={`/category/${s.slug}`} className="block whitespace-nowrap px-5 py-[3px] text-[14px] leading-[1.9] text-[#333] hover:text-accent">
                {pick(s, "name", lang)}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );

  const iconBtn = `grid size-9 place-items-center transition-colors hover:text-accent ${tone}`;

  return (
    <header className={`fixed inset-x-0 top-0 z-40 text-white transition-[background-color,height] duration-300 ${scrolled ? "bg-nav shadow-md" : "bg-transparent"} `}>
      {/* Desktop: logo centred, menu split on both sides (Site123 header layout 21) */}
      <div className={`mx-auto hidden w-full max-w-[1400px] grid-cols-[1fr_auto_1fr] items-center px-[15px] transition-[height] duration-300 md:grid ${scrolled ? "h-[80px]" : "h-[100px]"}`}>
        <nav aria-label="Primary" className="flex justify-end">
          <ul className="flex items-center">
            <li><Link href="/" className={link}>{t.nav.home}</Link></li>
            {startItems.map((c) => <Item key={c.id} c={c} />)}
          </ul>
        </nav>
        <Link href="/" className="mx-8 inline-flex items-center" aria-label={t.brand}>
          <Image src={LOGO_URL} alt={t.brand} width={120} height={100} unoptimized priority className={`${scrolled ? "h-[56px] brightness-0 invert" : "h-[80px]"} w-auto transition-all duration-300`} />
        </Link>
        <div className="flex items-center justify-start">
          <ul className="flex items-center">
            {endItems.map((c) => <Item key={c.id} c={c} />)}
            <li><Link href="/#contact" className={link}>{dict[lang].sections.contact}</Link></li>
          </ul>
          <div className="ms-2 flex items-center">
            <a href={`tel:${CONTACT.sitePhone.replace(/-/g, "")}`} className={iconBtn} aria-label={CONTACT.sitePhone}><Phone size={16} strokeWidth={1.75} /></a>
            <button type="button" onClick={openCart} aria-label={`${t.nav.cart} (${count})`} className={`relative ${iconBtn}`}>
              <ShoppingCart size={17} strokeWidth={1.75} />
              {count > 0 ? <span className="absolute -end-0.5 -top-0.5 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] leading-4 text-white tabular-nums">{count}</span> : null}
            </button>
            <button type="button" onClick={switchLang} className={`px-2 text-[12px] transition-colors hover:text-accent ${tone}`}>{t.toggles.lang}</button>
            <button type="button" onClick={switchTheme} aria-label={theme === "dark" ? t.toggles.toLight : t.toggles.toDark} className={iconBtn}>
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex h-[60px] items-center justify-between bg-nav px-3 text-white md:hidden">
        <button type="button" aria-label={t.nav.menu} aria-expanded={menu} onClick={() => setMenu((v) => !v)} className="grid size-10 place-items-center">
          {menu ? <X size={24} /> : <Menu size={24} />}
        </button>
        <Link href="/" aria-label={t.brand}><Image src={LOGO_URL} alt={t.brand} width={120} height={100} unoptimized className="h-[44px] w-auto brightness-0 invert" /></Link>
        <button type="button" onClick={openCart} aria-label={`${t.nav.cart} (${count})`} className="relative grid size-10 place-items-center">
          <ShoppingCart size={22} strokeWidth={1.75} />
          {count > 0 ? <span className="absolute end-0 top-0 grid min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] leading-4 text-white">{count}</span> : null}
        </button>
      </div>
      {menu ? (
        <nav aria-label="Mobile" className="max-h-[calc(100dvh-60px)] overflow-y-auto border-t border-white/10 bg-nav px-5 pb-6 text-center md:hidden">
          <ul className="space-y-1 pt-3 text-[20px]">
            <li><Link href="/" onClick={() => setMenu(false)} className="block py-2">{t.nav.home}</Link></li>
            {tops.map((c) => (
              <li key={c.id}>
                <Link href={`/category/${c.slug}`} onClick={() => setMenu(false)} className="block py-2">{pick(c, "name", lang)}</Link>
                {subs(c.id).map((s) => (
                  <Link key={s.id} href={`/category/${s.slug}`} onClick={() => setMenu(false)} className="block py-1 text-[16px] text-white/70">
                    {pick(s, "name", lang)}
                  </Link>
                ))}
              </li>
            ))}
            <li><Link href="/#contact" onClick={() => setMenu(false)} className="block py-2">{dict[lang].sections.contact}</Link></li>
          </ul>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 border-t border-white/10 pt-5 text-sm">
            <button type="button" onClick={switchLang} className="border border-white/30 px-4 py-2">{t.toggles.lang}</button>
            <button type="button" onClick={switchTheme} className="border border-white/30 px-4 py-2">{theme === "dark" ? t.toggles.toLight : t.toggles.toDark}</button>
            <Link href="/login" onClick={() => setMenu(false)} className="bg-accent px-5 py-2 text-white">{t.nav.login}</Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
