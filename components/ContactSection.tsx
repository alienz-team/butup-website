"use client";

import { Mail, Phone } from "lucide-react";
import { CONTACT, WA_GREETING, dict, waLink, type Lang } from "@/lib/i18n";

/** Site123 contact module (layout 3): details, a narrow form and a map side by side. */
export default function ContactSection({ lang }: { lang: Lang }) {
  const t = dict[lang];
  const c = t.contact;
  const field = "w-full rounded border border-line bg-white px-[1.1rem] py-3 text-base text-black outline-none placeholder:text-[#999] focus:border-accent";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const text = [WA_GREETING, `${c.name}: ${fd.get("name")}`, `${c.phone}: ${fd.get("phone") || "-"}`, `${c.email}: ${fd.get("email")}`, String(fd.get("message") || "")].join("\n");
    window.open(waLink(text), "_blank", "noopener,noreferrer");
  }

  const bbox = `${CONTACT.lng - 0.012},${CONTACT.lat - 0.007},${CONTACT.lng + 0.012},${CONTACT.lat + 0.007}`;

  return (
    <section id="contact" className="bg-cream py-[75px] text-black dark:text-white">
      <div className="text-center">
        <h2 className="display text-[33px]">{t.sections.contact}</h2>
        <hr className="title-rule" />
      </div>
      <div className="mx-auto mt-10 grid max-w-[1290px] gap-8 px-[15px] md:grid-cols-[300px_300px_1fr]">
        <ul className="space-y-1 text-center text-[1.05rem] md:pt-1">
          <li>{c.address}</li>
          <li>
            <a href={`tel:${CONTACT.sitePhone.replace(/-/g, "")}`} dir="ltr" className="inline-flex items-center gap-2 text-accent">
              {CONTACT.sitePhone} <Phone size={14} aria-hidden />
            </a>
          </li>
          <li>
            <a href={`mailto:${CONTACT.siteEmail}`} className="inline-flex items-center gap-2 text-accent">
              {CONTACT.siteEmail} <Mail size={14} aria-hidden />
            </a>
          </li>
        </ul>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input name="name" required placeholder={c.name} className={field} />
            <input name="phone" placeholder={c.phone} className={field} />
          </div>
          <input name="email" type="email" required dir="ltr" placeholder={c.email} className={`${field} text-start`} />
          <textarea name="message" rows={4} placeholder={c.message} className={field} />
          <button type="submit" className="block w-full bg-accent px-4 py-3.5 text-base text-white transition-opacity hover:opacity-90">{c.send}</button>
        </form>

        <div className="min-h-[360px] overflow-hidden md:min-h-[500px]">
          <iframe
            title={c.address}
            className="size-full min-h-[360px] border-0 md:min-h-[500px]"
            loading="lazy"
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${CONTACT.lat},${CONTACT.lng}`}
          />
        </div>
      </div>
    </section>
  );
}
