import Image from "next/image";
import Link from "next/link";
import { pick, type ProductDTO } from "@/lib/catalog";
import { dict, formatPrice, type Lang } from "@/lib/i18n";

/** Image, title, price. The second photo fades in on hover; nothing else competes with the picture. */
export default function ProductCard({
  product: p,
  lang,
  sizes = "(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw",
  priority = false,
}: {
  product: ProductDTO;
  lang: Lang;
  sizes?: string;
  priority?: boolean;
}) {
  const title = pick(p, "title", lang);
  const soldOut = p.stock <= 0;
  return (
    <Link href={`/product/${p.slug}`} className="group block" aria-label={title}>
      <div className="relative aspect-[3/4] overflow-hidden bg-surface2">
        <Image
          src={p.images[0]}
          alt={title}
          fill
          sizes={sizes}
          quality={85}
          priority={priority}
          className="object-cover transition duration-[1400ms] ease-out group-hover:scale-[1.04] group-focus-visible:scale-[1.04]"
        />
        {p.images[1] ? (
          <Image
            src={p.images[1]}
            alt=""
            fill
            sizes={sizes}
            quality={85}
            className="object-cover opacity-0 transition duration-700 ease-out group-hover:scale-[1.04] group-hover:opacity-100 group-focus-visible:opacity-100"
          />
        ) : null}
        {soldOut ? (
          <span className="absolute start-3 top-3 bg-bg/90 px-2.5 py-1 text-[11px]">{dict[lang].product.out}</span>
        ) : null}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className="text-[15px] font-normal leading-snug">{title}</h3>
        <p className="shrink-0 text-sm tabular-nums">
          {p.compareAtPrice ? <span className="me-2 text-muted line-through">{formatPrice(p.compareAtPrice, lang)}</span> : null}
          {formatPrice(p.price, lang)}
        </p>
      </div>
    </Link>
  );
}
