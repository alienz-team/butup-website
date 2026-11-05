import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/Icons";
import { CONTACT, LOGO_URL, WA_GREETING, dict, waLink, type Lang } from "@/lib/i18n";

export default function Footer({ lang }: { lang: Lang }) {
  const t = dict[lang];
  const link = "underline-link flex w-fit items-center gap-3 pb-0.5 text-sm";
  return (
    <footer id="contact" className="mt-32 border-t border-line">
      <div className="mx-auto grid max-w-[1500px] gap-14 px-5 py-20 md:grid-cols-[1.4fr_1fr_1fr] md:px-10">
        <div>
          <span className="logo-chip">
            <Image src={LOGO_URL} alt={t.brand} width={64} height={52} unoptimized className="h-12 w-auto" />
          </span>
          <p className="mt-6 max-w-sm text-sm leading-loose text-muted">{t.story.body}</p>
        </div>
        <nav aria-label="Footer">
          <ul className="space-y-4">
            <li><Link href="/shop" className={link}>{t.nav.shop}</Link></li>
            <li><Link href="/#categories" className={link}>{t.nav.categories}</Link></li>
            <li><Link href="/login" className={link}>{t.nav.login}</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className="display mb-5 text-2xl">{t.footer.follow}</h2>
          <ul className="space-y-4">
            <li>
              <a href={CONTACT.instagram} target="_blank" rel="noopener noreferrer" className={link}>
                <InstagramIcon /> <span dir="ltr">@{CONTACT.instagramHandle}</span>
              </a>
            </li>
            <li>
              <a href={CONTACT.facebook} target="_blank" rel="noopener noreferrer" className={link}>
                <FacebookIcon /> <span dir="ltr">{CONTACT.facebookName}</span>
              </a>
            </li>
            <li>
              <a href={waLink(WA_GREETING)} target="_blank" rel="noopener noreferrer" className={link}>
                <MessageCircle size={20} strokeWidth={1.4} aria-hidden /> <span dir="ltr">{CONTACT.whatsappDisplay}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} {t.brand} | {CONTACT.domain} | {t.footer.rights}
      </div>
    </footer>
  );
}
