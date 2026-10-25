import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { FacebookIcon, InstagramIcon } from "@/components/Icons";
import { CONTACT, LOGO_URL, WA_GREETING, dict, waLink, type Lang } from "@/lib/i18n";

export default function Footer({ lang }: { lang: Lang }) {
  const t = dict[lang];
  const link = "flex items-center gap-3 text-muted transition-colors hover:text-fg";
  return (
    <footer id="contact" className="border-t border-line bg-surface2">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr] md:px-8">
        <div>
          <span className="logo-chip">
            <Image src={LOGO_URL} alt={t.brand} width={64} height={52} unoptimized className="h-12 w-auto" />
          </span>
          <p className="mt-5 max-w-md leading-loose text-muted">{t.story.body}</p>
        </div>
        <div>
          <h2 className="font-display text-2xl">{t.footer.follow}</h2>
          <ul className="mt-4 space-y-3">
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
                <MessageCircle size={20} aria-hidden /> <span dir="ltr">{CONTACT.whatsappDisplay}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        © {new Date().getFullYear()} {t.brand} | {CONTACT.domain} | {t.footer.rights}
      </div>
    </footer>
  );
}
