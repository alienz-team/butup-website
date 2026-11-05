"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { dict, formatPrice, waLink, type Lang } from "@/lib/i18n";

type Step = "cart" | "checkout";

export default function CartDrawer({ lang }: { lang: Lang }) {
  const t = dict[lang].cart;
  const { items, subtotal, isOpen, closeCart, setQty, remove, clear } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const rtl = lang === "ar";

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  useEffect(() => {
    if (isOpen) setStep("cart");
  }, [isOpen]);

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
      const lines = items.map(
        (i) => `- ${i.qty} x ${i.titleAr} / ${i.titleEn}${i.size ? ` (${i.size})` : ""}${i.color ? ` (${i.color})` : ""}: ${formatPrice(i.price * i.qty, "en")}`,
      );
      const message = [
        `أهلاً بيوت أب (Beautup)، طلب جديد ${number}`,
        ...lines,
        `Total: ${formatPrice(subtotal, "en")}`,
        `Name: ${customerName}`,
        `Phone: ${customerPhone}`,
        `Address: ${address}`,
      ].join("\n");
      window.open(waLink(message), "_blank", "noopener,noreferrer");
      clear();
      closeCart();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  const field = "mt-2 w-full border-b border-line bg-transparent py-2 text-base outline-none focus:border-fg";

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-[60]">
          <motion.div
            className="absolute inset-0 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            aria-hidden
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t.title}
            className="absolute inset-y-0 end-0 flex w-full max-w-md flex-col bg-bg text-fg shadow-2xl"
            initial={{ x: rtl ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: rtl ? "-100%" : "100%" }}
            transition={{ type: "tween", ease: [0.22, 0.8, 0.2, 1], duration: 0.5 }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="display text-3xl">{t.title}</h2>
              <button type="button" onClick={closeCart} aria-label={t.close} className="grid size-9 place-items-center">
                <X size={20} strokeWidth={1.25} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-start justify-center gap-6 px-6">
                <p className="max-w-xs text-muted">{t.empty}</p>
                <Link href="/shop" onClick={closeCart} className="underline-link pb-1 text-sm">
                  {t.browse}
                </Link>
              </div>
            ) : step === "cart" ? (
              <>
                <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
                  {items.map((i) => (
                    <li key={i.key} className="flex gap-4 py-5">
                      <Link href={`/product/${i.slug}`} onClick={closeCart} className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden bg-surface2">
                        <Image src={i.image} alt="" fill sizes="80px" quality={75} className="object-cover" />
                      </Link>
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="truncate text-sm">{lang === "ar" ? i.titleAr : i.titleEn}</p>
                        <p className="mt-1 text-xs text-muted">{[i.size, i.color].filter(Boolean).join(" / ")}</p>
                        <div className="mt-auto flex items-center justify-between pt-3">
                          <div className="flex items-center border border-line">
                            <button type="button" aria-label={t.decrease} onClick={() => setQty(i.key, i.qty - 1)} className="grid size-8 place-items-center">
                              <Minus size={13} />
                            </button>
                            <span className="w-7 text-center text-sm tabular-nums">{i.qty}</span>
                            <button type="button" aria-label={t.increase} onClick={() => setQty(i.key, i.qty + 1)} className="grid size-8 place-items-center">
                              <Plus size={13} />
                            </button>
                          </div>
                          <span className="text-sm tabular-nums">{formatPrice(i.price * i.qty, lang)}</span>
                        </div>
                      </div>
                      <button type="button" onClick={() => remove(i.key)} aria-label={t.remove} className="self-start text-muted hover:text-fg">
                        <X size={15} strokeWidth={1.25} />
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-line px-6 py-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted">{t.subtotal}</span>
                    <span className="display text-3xl tabular-nums">{formatPrice(subtotal, lang)}</span>
                  </div>
                  <button type="button" onClick={() => setStep("checkout")} className="mt-5 w-full bg-fg py-4 text-sm text-bg transition-opacity hover:opacity-85">
                    {t.checkout}
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={placeOrder} className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
                <label className="block text-sm text-muted">
                  {t.name}
                  <input name="name" required maxLength={80} autoComplete="name" className={field} />
                </label>
                <label className="mt-6 block text-sm text-muted">
                  {t.phone}
                  <input name="phone" required type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="+218 9X XXX XXXX" className={`${field} text-start`} />
                </label>
                <label className="mt-6 block text-sm text-muted">
                  {t.address}
                  <textarea name="address" required rows={3} maxLength={300} autoComplete="street-address" className={field} />
                </label>
                {error ? (
                  <p role="alert" className="mt-5 text-sm text-red-600">
                    {t.error}
                  </p>
                ) : null}
                <div className="mt-auto pt-8">
                  <div className="mb-4 flex items-baseline justify-between">
                    <span className="text-sm text-muted">{t.subtotal}</span>
                    <span className="display text-3xl tabular-nums">{formatPrice(subtotal, lang)}</span>
                  </div>
                  <button disabled={busy} className="w-full bg-fg py-4 text-sm text-bg transition-opacity hover:opacity-85 disabled:opacity-50">
                    {busy ? t.placing : t.place}
                  </button>
                  <p className="mt-3 text-center text-xs text-muted">{t.note}</p>
                  <button type="button" onClick={() => setStep("cart")} className="underline-link mx-auto mt-4 block pb-1 text-xs text-muted">
                    {t.back}
                  </button>
                </div>
              </form>
            )}
          </motion.aside>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
