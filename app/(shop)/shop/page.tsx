import type { Metadata } from "next";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { pick } from "@/lib/catalog";
import { getPrefs } from "@/lib/prefs";
import { getCatalog } from "@/lib/store";

export const metadata: Metadata = { title: "Shop | المتجر" };

type Props = { searchParams: Promise<{ category?: string; q?: string }> };

export default async function ShopPage({ searchParams }: Props) {
  const { category, q } = await searchParams;
  const { lang, t } = await getPrefs();
  const { categories, products } = await getCatalog();
  const active = categories.find((c) => c.slug === category);
  const needle = (q ?? "").trim().toLowerCase();
  const items = products.filter(
    (p) =>
      (!active || p.categoryId === active.id) &&
      (!needle || `${p.titleAr} ${p.titleEn} ${p.descriptionEn} ${p.descriptionAr}`.toLowerCase().includes(needle)),
  );

  const tab = (on: boolean) => `underline-link pb-1 text-sm ${on ? "text-fg" : "text-muted"}`;

  return (
    <div className="mx-auto max-w-[1500px] px-5 pb-8 pt-14 md:px-10 md:pt-24">
      <h1 className="display text-6xl md:text-9xl">{active ? pick(active, "name", lang) : t.shop.title}</h1>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-b border-line pb-5">
        <nav aria-label={t.shop.title} className="flex flex-wrap gap-x-8 gap-y-3">
          <Link href="/shop" className={tab(!active)} aria-current={!active ? "page" : undefined}>
            {t.shop.all}
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/shop?category=${c.slug}`} className={tab(c.id === active?.id)} aria-current={c.id === active?.id ? "page" : undefined}>
              {pick(c, "name", lang)}
            </Link>
          ))}
        </nav>
        <p className="text-sm text-muted">
          {needle ? `"${q}" - ` : ""}
          {items.length} {t.shop.count}
        </p>
      </div>

      {items.length > 0 ? (
        <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8 md:gap-y-16 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((p, n) => (
            <Reveal key={p.id} delay={(n % 4) * 0.07}>
              <ProductCard product={p} lang={lang} priority={n < 4} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="py-32 text-center text-muted">{t.shop.empty}</p>
      )}
    </div>
  );
}
