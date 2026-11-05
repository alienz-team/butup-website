import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import SortSelect from "@/components/SortSelect";
import { money, pick, type ProductDTO } from "@/lib/catalog";
import { getPrefs } from "@/lib/prefs";
import { getCatalog } from "@/lib/store";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string; range?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { categories } = await getCatalog();
  const c = categories.find((x) => x.slug === slug);
  return c ? { title: `${c.nameAr} | ${c.nameEn}` } : {};
}

const SORTS = ["", "price-asc", "price-desc", "name"] as const;

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { sort = "", range } = await searchParams;
  const { lang, t } = await getPrefs();
  const { categories, products } = await getCatalog();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const parent = category.parentId ? categories.find((c) => c.id === category.parentId) : null;
  const children = categories.filter((c) => c.parentId === category.id);
  const ids = new Set([category.id, ...children.map((c) => c.id)]);
  const inCategory = products.filter((p) => ids.has(p.categoryId));

  // Price buckets, like the original's "السعر" filter: lowest third, middle third, highest third.
  const prices = inCategory.map((p) => p.price).sort((a, b) => a - b);
  const lo = prices[Math.floor(prices.length / 3)] ?? 0;
  const hi = prices[Math.floor((prices.length * 2) / 3)] ?? 0;
  const buckets = [
    { key: "low", label: `${lang === "ar" ? "تحت" : "Under"} ${money(lo, lang)}`, test: (p: ProductDTO) => p.price < lo },
    { key: "mid", label: `${money(lo, lang)} - ${money(hi, lang)}`, test: (p: ProductDTO) => p.price >= lo && p.price < hi },
    { key: "high", label: `${money(hi, lang)} ${lang === "ar" ? "وأعلى" : "and up"}`, test: (p: ProductDTO) => p.price >= hi },
  ].map((b) => ({ ...b, count: inCategory.filter(b.test).length }));
  const activeBucket = buckets.find((b) => b.key === range);

  let items = activeBucket ? inCategory.filter(activeBucket.test) : inCategory;
  if (sort === "price-asc") items = [...items].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") items = [...items].sort((a, b) => b.price - a.price);
  if (sort === "name") items = [...items].sort((a, b) => a.titleAr.localeCompare(b.titleAr, "ar"));

  const href = (q: Record<string, string>) => {
    const sp = new URLSearchParams(q);
    const s = sp.toString();
    return `/category/${slug}${s ? `?${s}` : ""}`;
  };
  const sortLabels: Record<string, string> = lang === "ar"
    ? { "": "ترتيب حسب", "price-asc": "السعر: من الأقل", "price-desc": "السعر: من الأعلى", name: "الاسم" }
    : { "": "Sort by", "price-asc": "Price: low to high", "price-desc": "Price: high to low", name: "Name" };

  return (
    <section className="min-h-[70vh] bg-bg pb-[75px] pt-[100px] text-black dark:text-white">
      <div className="mx-auto max-w-[1290px] px-[15px]">
        <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 py-2 text-[12px] text-muted">
          <Link href="/" className="text-accent">{t.category.home}</Link>
          {parent ? (
            <>
              <span aria-hidden>/</span>
              <Link href={`/category/${parent.slug}`} className="text-accent">{pick(parent, "name", lang)}</Link>
            </>
          ) : null}
          <span aria-hidden>/</span>
          <span>{pick(category, "name", lang)}</span>
        </nav>

        <div className="mt-4 text-center">
          <h1 className="display text-[2.4rem]">{pick(category, "name", lang)}</h1>
          <hr className="title-rule" />
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-[300px_1fr]">
          <aside className="md:order-1">
            <h2 className="flex items-center gap-2 border-b border-black pb-3 text-[1.4rem] font-bold dark:border-white">{lang === "ar" ? "التصفية" : "Filter"}</h2>
            <h3 className="border-b border-black py-2 font-bold dark:border-white">{lang === "ar" ? "السعر" : "Price"}</h3>
            <ul className="mt-3 space-y-2 text-[13px]">
              {buckets.map((b) => (
                <li key={b.key}>
                  <Link
                    href={href({ ...(sort ? { sort } : {}), ...(activeBucket?.key === b.key ? {} : { range: b.key }) })}
                    className={`text-accent ${activeBucket?.key === b.key ? "font-bold underline" : ""}`}
                  >
                    {b.label} ({b.count})
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <div className="md:order-2">
            <div className="mb-5 w-fit">
              <SortSelect base={`/category/${slug}`} range={range} value={SORTS.includes(sort as (typeof SORTS)[number]) ? sort : ""} options={sortLabels} label={sortLabels[""]} />
            </div>

            {items.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} lang={lang} />
                ))}
              </div>
            ) : (
              <p className="py-24 text-center text-muted">{t.category.empty}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
