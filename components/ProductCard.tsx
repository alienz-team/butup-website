import Link from "next/link";
import { money, pick, type ProductDTO } from "@/lib/catalog";
import { dict, type Lang } from "@/lib/i18n";

const discount = (p: ProductDTO) => (p.compareAtPrice && p.compareAtPrice > p.price ? Math.round((1 - p.price / p.compareAtPrice) * 100) : 0);

/** Site123 product box: white card with shadow, 3:4 photo (second photo on hover), title and price below. */
export default function ProductCard({ product: p, lang }: { product: ProductDTO; lang: Lang }) {
  const title = pick(p, "title", lang);
  const off = discount(p);
  const href = `/product/${p.slug}`;
  const bg = (src: string) => ({ backgroundImage: `url(${src})` });
  return (
    <div className="p-box h-full">
      <div className="relative">
        <Link href={href} aria-label={title} className="relative block w-full" style={{ paddingBottom: "133.3333%" }}>
          <span className="absolute inset-0 bg-cover bg-center" style={bg(p.images[0])} role="img" aria-label={title} />
          {p.images[1] ? <span className="second-image absolute inset-0 bg-cover bg-center" style={bg(p.images[1])} aria-hidden /> : null}
        </Link>
        {off > 0 ? (
          <span dir="ltr" className="absolute start-[10px] top-[15px] z-[1] rounded-[4px] bg-black p-1 text-[0.8em] text-white">-{off}%</span>
        ) : null}
        <div className="quick absolute inset-x-0 bottom-2 flex justify-center px-2">
          <Link href={href} className="flex w-full items-center justify-center rounded-lg bg-accent py-2 text-[0.8em] text-white opacity-90">
            {dict[lang].quickView}
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3 p-4">
        <h4 className="m-0 text-[1em] font-normal leading-normal">
          <Link href={href} className="line-clamp-2">{title}</Link>
        </h4>
        <p className="m-0 text-[1em]">
          {off > 0 && p.compareAtPrice ? (
            <span className="me-2 text-[0.7em] line-through opacity-40">{money(p.compareAtPrice, lang)}</span>
          ) : null}
          <Link href={href} className="text-accent">{money(p.price, lang)}</Link>
        </p>
      </div>
    </div>
  );
}
