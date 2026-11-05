import Link from "next/link";
import ContactSection from "@/components/ContactSection";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { HERO_IMAGES, homeProducts, pick } from "@/lib/catalog";
import { getPrefs } from "@/lib/prefs";
import { getCatalog } from "@/lib/store";

export default async function Home() {
  const { lang, t } = await getPrefs();
  const { categories, products } = await getCatalog();
  const tops = categories.filter((c) => !c.parentId);
  const countFor = (id: string) => {
    const ids = new Set([id, ...categories.filter((c) => c.parentId === id).map((c) => c.id)]);
    return products.filter((p) => ids.has(p.categoryId)).length;
  };

  return (
    <>
      <Hero lang={lang} images={HERO_IMAGES} />

      <section id="section-112" className="bg-bg py-[75px] text-black dark:text-white">
        <div className="text-center">
          <h2 className="display text-[33px]">{t.sections.categories}</h2>
          <hr className="title-rule" />
        </div>
        <div className="mx-auto mt-10 grid max-w-[1290px] grid-cols-2 gap-4 px-[15px] md:grid-cols-4 md:gap-5">
          {tops.map((c) => (
            <Link key={c.id} href={`/category/${c.slug}`} className="group relative block overflow-hidden rounded-lg" aria-label={pick(c, "name", lang)}>
              <div className="w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${c.image})`, paddingBottom: "100%" }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/[0.28] text-center text-white">
                <h4 className="px-3 text-[1.4em] leading-[1.2] md:text-[2em]">{pick(c, "name", lang)}</h4>
                <span className="text-[0.7em]">{countFor(c.id)} {t.count}</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-[75px] text-center">
          <h2 className="display text-[33px]">{t.sections.quick}</h2>
          <hr className="title-rule" />
        </div>
        <div className="mx-auto mt-10 grid max-w-[1290px] grid-cols-2 gap-4 px-[15px] md:grid-cols-4 md:gap-5">
          {homeProducts(products).map((p) => (
            <ProductCard key={p.id} product={p} lang={lang} />
          ))}
        </div>
      </section>

      <ContactSection lang={lang} />
    </>
  );
}
