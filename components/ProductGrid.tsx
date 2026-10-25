"use client";

import Image from "next/image";
import { Eye } from "lucide-react";
import { useCallback, useState } from "react";
import QuickShopModal from "@/components/QuickShopModal";
import { pick, type ProductDTO } from "@/lib/catalog";
import { dict, type Lang } from "@/lib/i18n";

export default function ProductGrid({ products, lang }: { products: ProductDTO[]; lang: Lang }) {
  const t = dict[lang].product;
  const [open, setOpen] = useState<ProductDTO | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
        {products.map((p, i) => {
          const discount = p.oldPrice && p.oldPrice > p.price ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
          return (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setOpen(p)}
                className="zoom group block w-full text-start"
                aria-label={`${t.quick}: ${pick(p, lang)}`}
              >
                <span className="relative block aspect-[4/5] overflow-hidden rounded-sm bg-surface2">
                  <Image
                    src={p.images[0]}
                    alt={pick(p, lang)}
                    fill
                    sizes="(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 48vw"
                    quality={75}
                    priority={i < 4}
                    className="zoom-img object-cover"
                  />
                  {discount > 0 ? (
                    <span className="absolute start-2 top-2 rounded-full bg-gold px-2.5 py-1 text-xs font-medium text-on-gold">
                      -{discount}%
                    </span>
                  ) : null}
                  <span className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-2 rounded-full bg-bg/90 py-2 text-sm backdrop-blur transition-all md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
                    <Eye size={15} aria-hidden /> {t.quick}
                  </span>
                </span>
                <span className="mt-3 block font-display text-xl leading-snug">{pick(p, lang)}</span>
                <span className="mt-1 flex items-baseline gap-2 text-sm">
                  <span dir="ltr" className="font-medium text-gold-ink">{p.price} LYD</span>
                  {p.oldPrice ? <s dir="ltr" className="text-muted">{p.oldPrice} LYD</s> : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      {open ? <QuickShopModal product={open} lang={lang} onClose={close} /> : null}
    </>
  );
}
