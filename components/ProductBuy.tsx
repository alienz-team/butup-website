"use client";

import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import type { ProductDTO } from "@/lib/catalog";
import { dict, type Lang } from "@/lib/i18n";

/** Size and color selectors plus the add-to-cart button. */
export default function ProductBuy({ product: p, lang }: { product: ProductDTO; lang: Lang }) {
  const t = dict[lang].product;
  const { add } = useCart();
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
    add({
      slug: p.slug,
      titleAr: p.titleAr,
      titleEn: p.titleEn,
      image: p.images[0],
      price: p.price,
      size,
      color: color ? color[lang] : null,
    });
  }

  return (
    <div className="mt-10 space-y-8">
      {p.colors.length > 0 ? (
        <fieldset>
          <legend className="text-sm text-muted">
            {t.color}: <span className="text-fg">{color?.[lang]}</span>
          </legend>
          <div className="mt-3 flex gap-3">
            {p.colors.map((c, n) => (
              <button
                key={c.hex + n}
                type="button"
                aria-label={c[lang]}
                aria-pressed={n === colorIdx}
                onClick={() => setColorIdx(n)}
                className={`size-9 rounded-full border p-[3px] transition-colors ${n === colorIdx ? "border-fg" : "border-transparent hover:border-line"}`}
              >
                <span className="block size-full rounded-full border border-line/60" style={{ background: c.hex }} />
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      {p.sizes.length > 0 ? (
        <fieldset>
          <legend className="text-sm text-muted">{t.size}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.sizes.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={s === size}
                onClick={() => {
                  setSize(s);
                  setNeedSize(false);
                }}
                className={`min-w-14 border px-4 py-3 text-sm transition-colors ${s === size ? "border-fg bg-fg text-bg" : "border-line hover:border-fg"}`}
              >
                {s}
              </button>
            ))}
          </div>
          {needSize ? (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {t.chooseSize}
            </p>
          ) : null}
        </fieldset>
      ) : null}

      <button
        type="button"
        onClick={onAdd}
        disabled={soldOut}
        className="w-full bg-fg py-5 text-sm text-bg transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {soldOut ? t.out : t.add}
      </button>
      {!soldOut && p.stock <= 5 ? <p className="text-center text-xs text-muted">{t.low}</p> : null}
    </div>
  );
}
