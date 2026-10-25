import { dict, type Lang } from "@/lib/i18n";

export default function Story({ lang }: { lang: Lang }) {
  const t = dict[lang].story;
  return (
    <section id="story" className="bg-blush">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-[auto_1fr] md:items-center md:gap-20 md:px-8 md:py-28">
        <div className="font-display leading-none text-gold-ink">
          <span className="block text-8xl font-medium md:text-[10rem]">2017</span>
          <span className="mt-2 block text-xl italic text-muted">{t.since}</span>
        </div>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-medium md:text-5xl">{t.title}</h2>
          <p className="mt-6 text-lg leading-loose text-muted md:text-xl md:leading-loose">{t.body}</p>
        </div>
      </div>
    </section>
  );
}
