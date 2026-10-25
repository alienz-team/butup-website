import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { pick, type CategoryDTO } from "@/lib/catalog";
import { dict, type Lang } from "@/lib/i18n";

// Asymmetric lookbook layout: one tall arched tile, two stacked beside it, one wide tile below.
const LAYOUT = [
  "h-[26rem] md:col-span-7 md:row-span-2 md:h-auto rounded-t-[12rem] md:rounded-t-[18rem] rounded-b-sm",
  "h-72 md:col-span-5 md:h-auto rounded-sm",
  "h-72 md:col-span-5 md:h-auto rounded-sm",
  "h-72 md:col-span-12 md:h-auto rounded-sm",
];

export default function CategoryBento({ categories, lang }: { categories: CategoryDTO[]; lang: Lang }) {
  const t = dict[lang].categories;
  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-28">
      <div className="mb-10 max-w-xl">
        <h2 className="font-display text-4xl font-medium md:text-5xl">{t.title}</h2>
        <p className="mt-3 text-muted">{t.hint}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:auto-rows-[17rem] md:grid-cols-12 md:gap-4">
        {categories.slice(0, 4).map((c, i) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className={`zoom group relative block overflow-hidden bg-surface2 ${LAYOUT[i]}`}
          >
            <Image
              src={c.image}
              alt=""
              fill
              sizes={i === 0 ? "(min-width: 768px) 58vw, 100vw" : i === 3 ? "100vw" : "(min-width: 768px) 42vw, 100vw"}
              quality={75}
              className="zoom-img object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white md:p-8">
              <div>
                <h3 className="font-display text-3xl font-medium md:text-4xl">{pick(c, lang)}</h3>
                {c.subs.length > 0 ? (
                  <p className="mt-1 text-sm text-white/80">{c.subs.map((s) => pick(s, lang)).join("  |  ")}</p>
                ) : null}
              </div>
              <span
                className="grid size-11 shrink-0 place-items-center rounded-full bg-white/15 backdrop-blur transition-colors group-hover:bg-gold group-hover:text-on-gold"
                aria-label={t.open}
              >
                <ArrowUpRight size={18} className="rtl:-scale-x-100" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
