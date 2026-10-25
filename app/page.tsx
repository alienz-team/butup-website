import Link from "next/link";
import CategoryBento from "@/components/CategoryBento";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MobileDock from "@/components/MobileDock";
import Navbar from "@/components/Navbar";
import ProductGrid from "@/components/ProductGrid";
import Story from "@/components/Story";
import { getPrefs } from "@/lib/prefs";
import { getCatalog } from "@/lib/store";

export default async function Home() {
  const [{ lang, theme, t }, { categories, products }] = await Promise.all([getPrefs(), getCatalog()]);
  const featured = products.filter((p) => p.featured).slice(0, 8);

  return (
    <>
      <Navbar lang={lang} theme={theme} />
      <main>
        <Hero lang={lang} />
        <CategoryBento categories={categories} lang={lang} />

        <section id="deals" className="mx-auto max-w-7xl px-4 pb-20 md:px-8 md:pb-28">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="font-display text-4xl font-medium md:text-5xl">{t.deals.title}</h2>
              <p className="mt-3 text-muted">{t.deals.hint}</p>
            </div>
            <Link href="/category/clothing" className="text-sm underline underline-offset-8 decoration-gold hover:text-gold-ink">
              {t.deals.all}
            </Link>
          </div>
          <ProductGrid products={featured} lang={lang} />
        </section>

        <Story lang={lang} />
      </main>
      <Footer lang={lang} />
      <MobileDock lang={lang} />
    </>
  );
}
