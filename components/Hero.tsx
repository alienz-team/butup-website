"use client";

import { useEffect, useState } from "react";
import { dict, type Lang } from "@/lib/i18n";

/**
 * Site123 "magic homepage" split layout: a peach text panel (50%) next to a full-height photo
 * carousel that fades between five images. No other motion.
 */
export default function Hero({ lang, images }: { lang: Lang; images: string[] }) {
  const t = dict[lang].hero;
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % images.length), 5000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <section id="top-section" dir="ltr" className="flex min-h-[100svh] flex-col pt-[60px] md:h-screen md:flex-row md:pt-0">
      <div dir={lang === "ar" ? "rtl" : "ltr"} className="flex flex-1 items-center justify-center bg-peach px-6 py-14 text-center text-black md:basis-1/2 md:py-0 dark:text-white">
        <div className="max-w-[650px]">
          <h1 className="font-hero font-bold leading-tight tracking-[0.12em]" style={{ fontSize: "max(2.4rem, calc(0.82 * (61 * (100vw / 1170) + 8px)))" }}>
            {t.title}
          </h1>
          <p className="mt-[9px] font-hero text-[22px] leading-[1.45]">{t.sub}</p>
        </div>
      </div>
      <div className="relative min-h-[50svh] flex-1 md:basis-1/2" aria-hidden>
        {images.map((src, n) => (
          <div
            key={src}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${n === i ? "opacity-100" : "opacity-0"}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
    </section>
  );
}
