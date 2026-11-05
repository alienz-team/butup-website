import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { HERO_IMAGES, pick } from "@/lib/catalog";
import { getPrefs } from "@/lib/prefs";
import { getCatalog } from "@/lib/store";

export default async function Home() {
  const { lang, t } = await getPrefs();
  const { categories, products } = await getCatalog();
  const featured = products.filter((p) => p.isFeatured).slice(0, 8);

  return (
    <>
      <Hero lang={lang} images={HERO_IMAGES} />

      <section id="featured" className="mx-auto max-w-[1500px] pt-28 md:pt-40">
        <Reveal className="flex items-end justify-between gap-6 px-5 md:px-10">
          <h2 className="display text-5xl md:text-7xl">{t.featured.title}</h2>
          <Link href="/shop" className="underline-link shrink-0 pb-1 text-sm">
            {t.featured.all}
          </Link>
        </Reveal>
        <div className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:gap-8 md:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {featured.map((p, n) => (
            <Reveal key={p.id} delay={Math.min(n, 4) * 0.08} className="w-[68vw] shrink-0 snap-start sm:w-[40vw] md:w-[26vw] xl:w-[22vw]">
              <ProductCard product={p} lang={lang} sizes="(min-width:1280px) 22vw, (min-width:768px) 26vw, 68vw" />
            </Reveal>
          ))}
        </div>
      </section>

      <section id="categories" className="mx-auto max-w-[1500px] px-5 pt-28 md:px-10 md:pt-40">
        <Reveal>
          <h2 className="display text-5xl md:text-7xl">{t.categories.title}</h2>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3 md:gap-8">
          {categories.map((c, n) => (
            <Reveal key={c.id} delay={n * 0.1}>
              <Link
                href={`/shop?category=${c.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden bg-surface2"
                aria-label={`${t.categories.open}: ${pick(c, "name", lang)}`}
              >
                <Image src={c.image} alt="" fill sizes="(min-width:768px) 33vw, 100vw" quality={85} className="object-cover transition duration-[1600ms] ease-out group-hover:scale-[1.05]" />
                <div className="absolute inset-0 bg-black/25 transition-colors duration-700 group-hover:bg-black/40" aria-hidden />
                <span className="display absolute inset-0 grid place-items-center px-6 text-center text-5xl text-[#f5f3ef] md:text-6xl">
                  {pick(c, "name", lang)}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="story" className="mx-auto max-w-[1500px] px-5 pt-28 md:px-10 md:pt-40">
        <Reveal className="max-w-4xl">
          <h2 className="display text-4xl md:text-6xl">{t.story.title}</h2>
          <p className="mt-8 max-w-xl text-base leading-loose text-muted md:text-lg">{t.story.body}</p>
        </Reveal>
      </section>
    </>
  );
}
