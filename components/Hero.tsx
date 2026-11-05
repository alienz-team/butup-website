"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { dict, type Lang } from "@/lib/i18n";

/** Full-screen opening: images cross-fade slowly while the wordmark rises into place once. */
export default function Hero({ lang, images }: { lang: Lang; images: string[] }) {
  const t = dict[lang];
  const [i, setI] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % images.length), 6500);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <section className="relative h-[calc(100svh-4rem)] min-h-[560px] w-full overflow-hidden bg-[#161514] text-[#f5f3ef] md:h-[calc(100svh-72px)]">
      <AnimatePresence initial={false}>
        <motion.div
          key={i}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { duration: 1.8 }, scale: { duration: 9, ease: "easeOut" } }}
        >
          <Image src={images[i]} alt="" fill priority={i === 0} sizes="100vw" quality={85} className="object-cover object-[center_28%]" />
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/25" aria-hidden />

      <div className="relative mx-auto flex h-full max-w-[1500px] flex-col justify-end px-5 pb-12 md:px-10 md:pb-16">
        <motion.h1
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 0.8, 0.2, 1], delay: 0.3 }}
          className="display text-[clamp(4.5rem,17vw,15rem)]"
        >
          {lang === "ar" ? "بيوت أب" : "Beautup"}
        </motion.h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1 }}
          className="mt-6 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <p className="max-w-md text-base leading-relaxed text-[#f5f3ef]/85 md:text-lg">{t.hero.line}</p>
          <Link
            href="/shop"
            className="w-fit border border-[#f5f3ef] bg-[#f5f3ef] px-10 py-4 text-sm text-[#0c0c0c] transition-colors hover:bg-transparent hover:text-[#f5f3ef]"
          >
            {t.hero.cta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
