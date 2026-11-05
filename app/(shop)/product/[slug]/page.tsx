import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductBuy from "@/components/ProductBuy";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { pick } from "@/lib/catalog";
import { formatPrice } from "@/lib/i18n";
import { getPrefs } from "@/lib/prefs";
import { getCatalog } from "@/lib/store";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { products } = await getCatalog();
  const p = products.find((x) => x.slug === slug);
  return p ? { title: `${p.titleAr} | ${p.titleEn}`, description: p.descriptionEn, openGraph: { images: [p.images[0]] } } : {};
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const { lang, t } = await getPrefs();
  const { categories, products } = await getCatalog();
  const p = products.find((x) => x.slug === slug);
  if (!p) notFound();

  const category = categories.find((c) => c.id === p.categoryId);
  const related = products.filter((x) => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 4);
  const title = pick(p, "title", lang);

  return (
    <>
      <div className="grid md:grid-cols-2">
        {/* Gallery scrolls with the page; the details column stays pinned. */}
        <div className="grid gap-px bg-line">
          {p.images.map((src, n) => (
            <div key={src} className="relative aspect-[4/5] bg-surface2">
              <Image src={src} alt={`${title} ${n + 1}`} fill priority={n === 0} sizes="(min-width:768px) 50vw, 100vw" quality={85} className="object-cover" />
            </div>
          ))}
        </div>

        <div className="md:sticky md:top-[72px] md:h-[calc(100svh-72px)] md:overflow-y-auto">
          <div className="flex min-h-full flex-col justify-center px-5 py-12 md:px-14 lg:px-20">
            <nav aria-label="Breadcrumb" className="mb-8 flex gap-3 text-sm text-muted">
              <Link href="/shop" className="underline-link pb-0.5">{t.product.back}</Link>
              {category ? (
                <>
                  <span aria-hidden>/</span>
                  <Link href={`/shop?category=${category.slug}`} className="underline-link pb-0.5">{pick(category, "name", lang)}</Link>
                </>
              ) : null}
            </nav>
            <h1 className="display text-5xl lg:text-6xl">{title}</h1>
            <p className="mt-6 text-xl tabular-nums">
              {p.compareAtPrice ? <span className="me-3 text-base text-muted line-through">{formatPrice(p.compareAtPrice, lang)}</span> : null}
              {formatPrice(p.price, lang)}
            </p>
            <p className="mt-8 max-w-md leading-loose text-muted">{pick(p, "description", lang)}</p>
            <div className="max-w-md">
              <ProductBuy product={p} lang={lang} />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mx-auto max-w-[1500px] px-5 pt-28 md:px-10 md:pt-36">
          <Reveal>
            <h2 className="display text-4xl md:text-6xl">{t.product.related}</h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-8 lg:grid-cols-4">
            {related.map((r, n) => (
              <Reveal key={r.id} delay={n * 0.07}>
                <ProductCard product={r} lang={lang} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}
