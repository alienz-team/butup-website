"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { HERO_SLIDES } from "@/lib/catalog";
import { dict, type Lang } from "@/lib/i18n";

const INTERVAL = 6500;

export default function HeroSlider({ lang }: { lang: Lang }) {
  const t = dict[lang].hero;
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = HERO_SLIDES.length;
  const autoplay = !reduce && !paused;

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % total), INTERVAL);
    return () => window.clearTimeout(id);
  }, [index, autoplay, total]);

  // Only the current, previous and next slides are mounted so we never load seven 1600px photos at once.
  const visible = new Set([index, (index + 1) % total, (index + total - 1) % total]);
  const slide = HERO_SLIDES[index];

  return (
    <section
      id="top"
      aria-roledescription="carousel"
      aria-label={t.headline}
      className="relative isolate h-[86svh] min-h-[520px] w-full overflow-hidden bg-[#1a1612] text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      {HERO_SLIDES.map((s, i) =>
        visible.has(i) ? (
          <motion.div
            key={s.image}
            className="absolute inset-0"
            initial={{ opacity: i === 0 ? 1 : 0, scale: 1.02 }}
            animate={i === index ? { opacity: 1, scale: reduce ? 1 : 1.09 } : { opacity: 0 }}
            transition={{
              opacity: { duration: reduce ? 0 : 1.8, ease: "easeInOut" },
              scale: { duration: reduce ? 0 : 10, ease: "linear" },
            }}
            aria-hidden={i !== index}
          >
            <Image
              src={s.image}
              alt={t.slides[i]}
              fill
              sizes="100vw"
              quality={85}
              priority={i === 0}
              className="object-cover"
            />
          </motion.div>
        ) : null,
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 md:px-8 md:pb-20">
        <h1 className="max-w-3xl font-display text-[2.6rem] leading-[1.25] font-medium md:text-7xl md:leading-[1.2]">
          {t.headline}
        </h1>
        <p className="mt-4 font-display text-xl italic text-white/80 md:text-2xl" aria-live={autoplay ? "off" : "polite"}>
          {t.slides[index]}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="#deals"
            className="rounded-full bg-gold px-7 py-3 text-sm font-medium text-on-gold transition-transform hover:-translate-y-0.5"
          >
            {t.cta}
          </Link>
          <Link
            href={`/category/${slide.categorySlug}`}
            className="rounded-full border border-white/50 px-7 py-3 text-sm backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            {t.cta2}
          </Link>
        </div>

        <div className="mt-10 flex items-center gap-2" role="tablist" aria-label="Slides">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${i + 1} / ${total}: ${t.slides[i]}`}
              onClick={() => setIndex(i)}
              className="group relative h-6 w-9"
            >
              <span className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-white/35" />
              {i === index ? (
                <motion.span
                  key={`${index}-${autoplay}`}
                  className="absolute start-0 top-1/2 h-[2px] -translate-y-1/2 bg-gold"
                  initial={{ width: autoplay ? "0%" : "100%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: autoplay ? INTERVAL / 1000 : 0, ease: "linear" }}
                />
              ) : null}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
