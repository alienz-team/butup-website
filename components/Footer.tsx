import Link from "next/link";
import { pick, type CategoryDTO } from "@/lib/catalog";
import { CONTACT, dict, type Lang } from "@/lib/i18n";

/** Site123 footer_1: black bar, 40px padding, 0.8rem text. Copyright on one side, page links on the other. */
export default function Footer({ lang, categories }: { lang: Lang; categories: CategoryDTO[] }) {
  const t = dict[lang];
  const tops = categories.filter((c) => !c.parentId);
  const subs = (id: string) => categories.filter((c) => c.parentId === id);
  const a = "block px-[15px] py-2 text-[0.8rem] text-white transition-colors hover:text-accent";
  return (
    <footer className="bg-footer py-10 text-[0.8rem] text-white">
      <div className="mx-auto flex max-w-[1290px] flex-col gap-6 px-[15px] md:flex-row md:items-center md:justify-between">
        <div className="text-start">
          <div className="text-[18px] font-bold">{t.brand}</div>
          <div className="mt-1">{t.footer.rights.replace("{year}", String(new Date().getFullYear()))}</div>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center md:justify-end">
            <li><Link href="/" className={a}>{t.nav.home}</Link></li>
            {tops.map((c) => (
              <li key={c.id} className="group relative">
                <Link href={`/category/${c.slug}`} className={a}>{pick(c, "name", lang)}</Link>
                {subs(c.id).length > 0 ? (
                  <ul className="invisible absolute bottom-full start-0 z-10 min-w-[160px] bg-black py-1 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    {subs(c.id).map((s) => (
                      <li key={s.id}><Link href={`/category/${s.slug}`} className="block whitespace-nowrap px-4 py-[2px] leading-[2.5] hover:text-accent">{pick(s, "name", lang)}</Link></li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
            <li><Link href="/#contact" className={a}>{t.sections.contact}</Link></li>
            <li><Link href="/login" className={a}>{t.nav.login}</Link></li>
          </ul>
        </nav>
      </div>
      <div className="mx-auto mt-4 max-w-[1290px] px-[15px] text-center text-white/60">
        <a href={`tel:${CONTACT.sitePhone.replace(/-/g, "")}`} dir="ltr" className="hover:text-accent">{CONTACT.sitePhone}</a>
        <span className="mx-3">|</span>
        <a href={`https://maps.google.com?q=${encodeURIComponent(t.contact.address)}`} target="_blank" rel="noopener noreferrer" className="hover:text-accent">{t.contact.address}</a>
      </div>
    </footer>
  );
}
