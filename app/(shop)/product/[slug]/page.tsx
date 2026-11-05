import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductBuy from "@/components/ProductBuy";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { money, pick } from "@/lib/catalog";
import { getPrefs } from "@/lib/prefs";
import { getCatalog } from "@/lib/store";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { products } = await getCatalog();
  const p = products.find((x) => x.slug === slug);
  return p ? { title: `${p.titleAr} | ${p.titleEn}`, openGraph: { images: [p.images[0]] } } : {};
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const { lang, t } = await getPrefs();
  const { categories, products } = await getCatalog();
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();

  const category = categories.find((c) => c.id === p.categoryId);
  const parent = category?.parentId ? categories.find((c) => c.id === category.parentId) : null;
  const related = products.filter((x) => x.id !== p.id && x.categoryId === p.categoryId).slice(0, 4);
  const title = pick(p, "title", lang);
  const description = pick(p, "description", lang);
  const onSale = p.compareAtPrice && p.compareAtPrice > p.price ? p.compareAtPrice : null;

  return (
    <>
      <section className="bg-bg pb-[75px] pt-[100px] text-black dark:text-white">
        <div className="mx-auto max-w-[1290px] px-[15px]">
          <nav aria-label="Breadcrumb" className="flex flex-wrap gap-2 py-2 text-[12px] text-muted">
            <Link href="/" className="text-accent">{t.category.home}</Link>
            {parent ? (
              <>
                <span aria-hidden>/</span>
                <Link href={`/category/${parent.slug}`} className="text-accent">{pick(parent, "name", lang)}</Link>
              </>
            ) : null}
            {category ? (
              <>
                <span aria-hidden>/</span>
                <Link href={`/category/${category.slug}`} className="text-accent">{pick(category, "name", lang)}</Link>
              </>
            ) : null}
            <span aria-hidden>/</span>
            <span>{title}</span>
          </nav>

          <div className="mt-4 text-center">
            <h1 className="display text-[2.4rem]">{title}</h1>
            <hr className="title-rule" />
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-[375px_1fr]">
            <ProductGallery images={p.images} title={title} />
            <div className="md:max-w-[630px]">
              <p className="flex flex-wrap items-center gap-3 text-[2.2rem] leading-none">
                <span>{money(p.price, lang)}</span>
                {onSale ? (
                  <>
                    <span className="text-[1.1rem] line-through opacity-40">{money(onSale, lang)}</span>
                    <span dir="ltr" className="rounded bg-black px-2 py-1 text-[0.9rem] text-white">-{Math.round((1 - p.price / onSale) * 100)}%</span>
                  </>
                ) : null}
              </p>
              {description ? <p className="mt-5 leading-loose">{description}</p> : null}
              <hr className="mt-8 border-black dark:border-white" />
              <ProductBuy product={p} lang={lang} />
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 ? (
        <section className="bg-bg pb-[75px] text-black dark:text-white">
          <div className="text-center">
            <h2 className="display text-[1.6rem]">{t.product.related}</h2>
            <hr className="title-rule" />
          </div>
          <div className="mx-auto mt-10 grid max-w-[1290px] grid-cols-2 gap-4 px-[15px] md:grid-cols-4 md:gap-5">
            {related.map((r) => (
              <ProductCard key={r.id} product={r} lang={lang} />
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
