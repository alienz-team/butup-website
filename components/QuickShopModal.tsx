"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Check, MessageCircle, Minus, Plus, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { pick, type ProductDTO } from "@/lib/catalog";
import { dict, productMessage, waLink, type Lang } from "@/lib/i18n";

const MAX_QTY = 10;

export default function QuickShopModal({
  product: p,
  lang,
  onClose,
}: {
  product: ProductDTO;
  lang: Lang;
  onClose: () => void;
}) {
  const t = dict[lang].product;
  const [shot, setShot] = useState(0);
  const [size, setSize] = useState(p.sizes[0] ?? "");
  const [colorIdx, setColorIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [visible, setVisible] = useState(true);
  const panel = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  const color = p.colors[colorIdx];
  const name = pick(p, lang);
  const out = p.stock <= 0;
  const cname = (c: { ar: string; en: string }) => (lang === "ar" ? c.ar : c.en);

  // Closing runs the exit animation first; the parent unmounts us on onExitComplete.
  const requestClose = useCallback(() => setVisible(false), []);

  useEffect(() => {
    opener.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") return requestClose();
      if (e.key !== "Tab" || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])");
      if (f.length === 0) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      (opener.current as HTMLElement | null)?.focus?.();
    };
  }, [requestClose]);

  const extra = [
    size && `${t.size}: ${size}`,
    color && `${t.color}: ${cname(color)}`,
    qty > 1 && `${t.qty}: ${qty}`,
  ].filter(Boolean) as string[];
  const href = waLink(productMessage({ name: p.nameAr, code: p.code, price: p.price }, extra));

  // Record the order in the background; the WhatsApp link opens regardless of the result.
  const recordOrder = () => {
    fetch("/api/orders", {
      method: "POST",
      keepalive: true,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        items: [{ code: p.code, qty, size: size || null, color: color ? color.en : null }],
      }),
    }).catch(() => {});
  };

  return (
    <AnimatePresence onExitComplete={onClose}>
      {visible ? (
        <motion.div
          key="overlay"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/55 backdrop-blur-sm md:items-center md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => e.target === e.currentTarget && requestClose()}
        >
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label={name}
            className="grid max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-t-2xl bg-bg md:max-h-[85dvh] md:grid-cols-2 md:rounded-2xl"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.7, 0.2, 1] }}
          >
            <div className="bg-surface2 p-3 md:p-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                <Image
                  key={p.images[shot]}
                  src={p.images[shot]}
                  alt={name}
                  fill
                  sizes="(min-width: 768px) 440px, 100vw"
                  quality={85}
                  className="object-cover"
                  priority
                />
              </div>
              {p.images.length > 1 ? (
                <div className="mt-3 flex gap-2">
                  {p.images.map((src, i) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setShot(i)}
                      aria-label={`${name} ${i + 1}`}
                      aria-current={i === shot}
                      className={`relative size-16 overflow-hidden rounded-md border-2 ${i === shot ? "border-gold" : "border-transparent opacity-70"}`}
                    >
                      <Image src={src} alt="" fill sizes="64px" quality={75} className="object-cover" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative flex flex-col p-6 md:p-8">
              <button
                type="button"
                onClick={requestClose}
                data-autofocus
                aria-label={t.close}
                className="absolute end-4 top-4 grid size-9 place-items-center rounded-full border border-line hover:border-gold"
              >
                <X size={16} />
              </button>

              <h2 className="pe-10 font-display text-3xl leading-tight font-medium">{name}</h2>
              <p className="mt-1 text-xs text-muted">
                {t.code}: {p.code}
              </p>

              <div className="mt-4 flex items-baseline gap-3">
                <span dir="ltr" className="font-display text-3xl text-gold-ink">{p.price} LYD</span>
                {p.oldPrice ? <s dir="ltr" className="text-muted">{p.oldPrice} LYD</s> : null}
              </div>

              <p className="mt-4 leading-relaxed text-muted">{lang === "ar" ? p.descAr : p.descEn}</p>

              {p.sizes.length > 0 ? (
                <fieldset className="mt-6">
                  <legend className="mb-2 text-sm">{t.size}</legend>
                  <div className="flex flex-wrap gap-2">
                    {p.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        aria-pressed={s === size}
                        className={`min-w-11 rounded-full border px-4 py-2 text-sm transition-colors ${s === size ? "border-gold bg-gold text-on-gold" : "border-line hover:border-gold"}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              {p.colors.length > 0 ? (
                <fieldset className="mt-5">
                  <legend className="mb-2 text-sm">
                    {t.color}: <span className="text-muted">{color ? cname(color) : ""}</span>
                  </legend>
                  <div className="flex flex-wrap gap-3">
                    {p.colors.map((c, i) => (
                      <button
                        key={c.hex + i}
                        type="button"
                        onClick={() => setColorIdx(i)}
                        aria-pressed={i === colorIdx}
                        aria-label={cname(c)}
                        title={cname(c)}
                        className={`grid size-9 place-items-center rounded-full border-2 ${i === colorIdx ? "border-gold" : "border-line"}`}
                      >
                        <span className="grid size-6 place-items-center rounded-full border border-black/10" style={{ background: c.hex }}>
                          {i === colorIdx ? <Check size={13} className="mix-blend-difference text-white" /> : null}
                        </span>
                      </button>
                    ))}
                  </div>
                </fieldset>
              ) : null}

              <div className="mt-5 flex items-center gap-4">
                <span className="text-sm">{t.qty}</span>
                <div className="flex items-center rounded-full border border-line">
                  <button type="button" aria-label="-" onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid size-9 place-items-center">
                    <Minus size={14} />
                  </button>
                  <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">{qty}</span>
                  <button type="button" aria-label="+" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} className="grid size-9 place-items-center">
                    <Plus size={14} />
                  </button>
                </div>
                <span className={`ms-auto text-xs ${out ? "text-red-600" : p.stock <= 5 ? "text-gold-ink" : "text-muted"}`}>
                  {out ? t.out : p.stock <= 5 ? t.low : t.inStock}
                </span>
              </div>

              {out ? (
                <span className="mt-8 flex items-center justify-center gap-2 rounded-full bg-surface2 py-3.5 text-muted" aria-disabled="true">
                  {t.out}
                </span>
              ) : (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={recordOrder}
                  className="mt-8 flex items-center justify-center gap-2 rounded-full bg-[#1f8f4e] py-3.5 font-medium text-white transition-transform hover:-translate-y-0.5"
                >
                  <MessageCircle size={18} aria-hidden /> {t.order}
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
