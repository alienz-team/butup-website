import Image from "next/image";
import Link from "next/link";
import { dict, type Lang } from "@/lib/i18n";

const HERO_IMAGE = "https://images.cdn-files-a.com/ready_uploads/media/8900825/2000_6373f3039b134.jpg";

export default function Hero({ lang }: { lang: Lang }) {
  const t = dict[lang].hero;

  return (
    <section id="top" className="relative isolate h-[86svh] min-h-[520px] w-full overflow-hidden bg-[#1a1612] text-white">
      <Image src={HERO_IMAGE} alt={t.alt} fill sizes="100vw" quality={85} priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/30" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 md:px-8 md:pb-20">
        <h1 dir="ltr" className="font-display text-[3.4rem] leading-[1.1] font-medium md:text-8xl">
          {t.title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-8 text-white/85 md:text-lg">{t.subtitle}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="#deals"
            className="rounded-full bg-gold px-7 py-3 text-sm font-medium text-on-gold transition-transform hover:-translate-y-0.5"
          >
            {t.cta}
          </Link>
          <Link
            href="#categories"
            className="rounded-full border border-white/50 px-7 py-3 text-sm backdrop-blur-sm transition-colors hover:bg-white/10"
          >
            {t.cta2}
          </Link>
        </div>
      </div>
    </section>
  );
}
