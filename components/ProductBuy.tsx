"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import type { ProductDTO } from "@/lib/catalog";
import { dict, type Lang } from "@/lib/i18n";

/** Quantity, optional size and colour, and the add-to-cart button. */
export default function ProductBuy({ product: p, lang }: { product: ProductDTO; lang: Lang }) {
  const t = dict[lang].product;
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState<string | null>(null);
  const [colorIdx, setColorIdx] = useState(0);
  const [needSize, setNeedSize] = useState(false);
  const soldOut = p.stock <= 0;
  const color = p.colors[colorIdx];

  function onAdd() {
    if (p.sizes.length > 0 && !size) {
      setNeedSize(true);
      return;
    }
    add({ slug: p.slug, titleAr: p.titleAr, titleEn: p.titleEn, image: p.images[0], price: p.price, size, color: color ? color[lang] : null }, qty);
  }

  const chip = (on: boolean) =>
    `min-w-12 rounded border px-3 py-2 text-sm transition-colors ${on ? "border-accent bg-accent text-white" : "border-line bg-surface hover:border-accent"}`;

  return (
    <div className="mt-8 space-y-6">
      {p.colors.length > 0 ? (
        <fieldset>
          <legend className="mb-2 text-sm">
            {t.color}: {color?.[lang]}
          </legend>
          <div className="flex gap-2">
            {p.colors.map((c, n) => (
              <button
                key={c.hex + n}
                type="button"
                aria-label={c[lang]}
                aria-pressed={n === colorIdx}
                onClick={() => setColorIdx(n)}
                className={`size-9 rounded-full border-2 p-[3px] ${n === colorIdx ? "border-accent" : "border-transparent"}`}
              >
                <span className="block size-full rounded-full border border-black/10" style={{ background: c.hex }} />
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {p.sizes.length > 0 ? (
        <fieldset>
          <legend className="mb-2 text-sm">{t.size}</legend>
          <div className="flex flex-wrap gap-2">
            {p.sizes.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={s === size}
                onClick={() => {
                  setSize(s);
                  setNeedSize(false);
                }}
                className={chip(s === size)}
              >
                {s}
              </button>
            ))}
          </div>
          {needSize ? (
            <p role="alert" className="mt-2 text-sm text-red-600">
              {t.chooseSize}
            </p>
          ) : null}
        </fieldset>
      ) : null}

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-stretch overflow-hidden rounded border border-accent bg-white text-black">
          <button type="button" aria-label="+" onClick={() => setQty((q) => Math.min(10, q + 1))} className="h-[51px] w-[50px] bg-accent text-lg text-white">
            +
          </button>
          <span aria-label={t.qty} className="grid w-[65px] place-items-center tabular-nums">
            {qty}
          </span>
          <button type="button" aria-label="-" onClick={() => setQty((q) => Math.max(1, q - 1))} className="h-[51px] w-[50px] bg-accent text-lg text-white">
            &minus;
          </button>
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={soldOut}
          className="h-[51px] bg-accent px-8 text-base text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {soldOut ? t.out : t.add}
        </button>
      </div>
    </div>
  );
}
