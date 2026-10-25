import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import MobileDock from "@/components/MobileDock";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import { pick } from "@/lib/catalog";
import { getPrefs } from "@/lib/prefs";
import { getCatalog } from "@/lib/store";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ sub?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { categories } = await getCatalog();
  const c = categories.find((x) => x.slug === slug);
  return c ? { title: `${c.nameAr} | ${c.nameEn}` } : {};
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const [{ slug }, { sub }, { lang, theme, t }, { categories, products }] = await Promise.all([
    params,
    searchParams,
    getPrefs(),
    getCatalog(),
  ]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const activeSub = category.subs.find((s) => s.slug === sub);
  const items = products.filter((p) => p.categorySlug === slug && (!activeSub || p.subSlug === activeSub.slug));

  const chip = (on: boolean) =>
    `rounded-full border px-5 py-2 text-sm transition-colors ${on ? "border-gold bg-gold text-on-gold" : "border-line hover:border-gold"}`;

  return (
    <>
      <Navbar lang={lang} theme={theme} />
      <main className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <Link href="/" className="text-sm text-muted hover:text-fg">
          {t.category.back}
        </Link>
        <h1 className="mt-4 font-display text-5xl font-medium md:text-6xl">{pick(category, lang)}</h1>

        {category.subs.length > 0 ? (
          <nav aria-label={pick(category, lang)} className="mt-8 flex flex-wrap gap-2">
            <Link href={`/category/${slug}`} className={chip(!activeSub)} aria-current={!activeSub}>
              {t.category.all}
            </Link>
            {category.subs.map((s) => (
              <Link key={s.slug} href={`/category/${slug}?sub=${s.slug}`} className={chip(s.slug === activeSub?.slug)} aria-current={s.slug === activeSub?.slug}>
                {pick(s, lang)}
              </Link>
            ))}
          </nav>
        ) : null}

        <div className="mt-10">
          {items.length > 0 ? (
            <ProductGrid products={items} lang={lang} />
          ) : (
            <p className="py-20 text-center text-muted">{t.category.empty}</p>
          )}
        </div>
      </main>
      <Footer lang={lang} />
      <MobileDock lang={lang} />
    </>
  );
}
