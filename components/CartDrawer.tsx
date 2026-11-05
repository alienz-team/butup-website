"use client";

import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { money } from "@/lib/catalog";
import { dict, waLink, type Lang } from "@/lib/i18n";

type Step = "cart" | "checkout";

/** Plain side drawer: a CSS slide, no animation library. */
export default function CartDrawer({ lang }: { lang: Lang }) {
  const t = dict[lang].cart;
  const { items, subtotal, isOpen, closeCart, setQty, remove, clear } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setStep("cart");
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  async function placeOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const customerName = String(fd.get("name") ?? "");
    const customerPhone = String(fd.get("phone") ?? "");
    const address = String(fd.get("address") ?? "");
    setBusy(true);
    setError(false);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone,
          address,
          items: items.map((i) => ({ slug: i.slug, qty: i.qty, size: i.size, color: i.color })),
        }),
      });
      if (!res.ok) throw new Error("order failed");
      const { number } = (await res.json()) as { number: string };
      const lines = items.map((i) => `- ${i.qty} x ${i.titleAr}${i.size ? ` (${i.size})` : ""}${i.color ? ` (${i.color})` : ""}: ${money(i.price * i.qty)}`);
      const message = [`أهلاً بيوت أب (Beautup)، طلب جديد ${number}`, ...lines, `المجموع: ${money(subtotal)}`, `الاسم: ${customerName}`, `الهاتف: ${customerPhone}`, `العنوان: ${address}`].join("\n");
      window.open(waLink(message), "_blank", "noopener,noreferrer");
      clear();
      closeCart();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  const field = "mt-1 w-full border border-line bg-surface px-3 py-2.5 text-base outline-none focus:border-accent";
  const primary = "block w-full rounded bg-accent px-4 py-3 text-center text-base text-white transition-opacity hover:opacity-90 disabled:opacity-50";

  return (
    <div className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <div onClick={closeCart} className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t.title}
        className={`absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-surface text-fg shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "ltr:translate-x-full rtl:-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="display text-xl">{t.title}</h2>
          <button type="button" onClick={closeCart} aria-label={t.close} className="grid size-9 place-items-center">
            <X size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
            <p className="text-muted">{t.empty}</p>
            <Link href="/" onClick={closeCart} className="rounded bg-accent px-6 py-2.5 text-white">{t.browse}</Link>
          </div>
        ) : step === "cart" ? (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {items.map((i) => (
                <li key={i.key} className="flex gap-3 py-4">
                  <Link href={`/product/${i.slug}`} onClick={closeCart} className="relative block w-20 shrink-0 bg-cover bg-center" style={{ backgroundImage: `url(${i.image})`, paddingBottom: "106%" }} aria-label={lang === "ar" ? i.titleAr : i.titleEn} />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="line-clamp-2 text-sm">{lang === "ar" ? i.titleAr : i.titleEn}</p>
                    {i.size || i.color ? <p className="mt-1 text-xs text-muted">{[i.size, i.color].filter(Boolean).join(" / ")}</p> : null}
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center border border-line">
                        <button type="button" aria-label={t.decrease} onClick={() => setQty(i.key, i.qty - 1)} className="grid size-8 place-items-center"><Minus size={13} /></button>
                        <span className="w-7 text-center text-sm tabular-nums">{i.qty}</span>
                        <button type="button" aria-label={t.increase} onClick={() => setQty(i.key, i.qty + 1)} className="grid size-8 place-items-center"><Plus size={13} /></button>
                      </div>
                      <span className="text-sm tabular-nums">{money(i.price * i.qty, lang)}</span>
                    </div>
                  </div>
                  <button type="button" onClick={() => remove(i.key)} aria-label={t.remove} className="self-start text-muted hover:text-accent"><X size={16} /></button>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-5 py-5">
              <div className="mb-4 flex items-baseline justify-between">
                <span className="text-sm text-muted">{t.subtotal}</span>
                <span className="text-xl tabular-nums">{money(subtotal, lang)}</span>
              </div>
              <button type="button" onClick={() => setStep("checkout")} className={primary}>{t.checkout}</button>
            </div>
          </>
        ) : (
          <form onSubmit={placeOrder} className="flex flex-1 flex-col overflow-y-auto px-5 py-5">
            <label className="block text-sm">{t.name}<input name="name" required maxLength={80} autoComplete="name" className={field} /></label>
            <label className="mt-4 block text-sm">{t.phone}<input name="phone" required type="tel" inputMode="tel" autoComplete="tel" dir="ltr" className={`${field} text-start`} /></label>
            <label className="mt-4 block text-sm">{t.address}<textarea name="address" required rows={3} maxLength={300} autoComplete="street-address" className={field} /></label>
            {error ? <p role="alert" className="mt-4 text-sm text-red-600">{t.error}</p> : null}
            <div className="mt-auto pt-6">
              <div className="mb-4 flex items-baseline justify-between">
                <span className="text-sm text-muted">{t.subtotal}</span>
                <span className="text-xl tabular-nums">{money(subtotal, lang)}</span>
              </div>
              <button disabled={busy} className={primary}>{busy ? t.placing : t.place}</button>
              <button type="button" onClick={() => setStep("cart")} className="mx-auto mt-3 block text-sm text-muted hover:text-accent">{t.back}</button>
            </div>
          </form>
        )}
      </aside>
    </div>
  );
}
