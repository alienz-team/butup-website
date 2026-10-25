"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, LayoutGrid, MessageCircle, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { dict, waLink, WA_GREETING, type Lang } from "@/lib/i18n";

export default function MobileDock({ lang }: { lang: Lang }) {
  const t = dict[lang].dock;
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const item = "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] text-muted active:text-fg";

  return (
    <div className="md:hidden">
      <AnimatePresence>
        {showTop ? (
          <motion.button
            type="button"
            aria-label={t.top}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed end-4 bottom-24 z-40 grid size-11 place-items-center rounded-full border border-line bg-bg/90 text-fg shadow-lg backdrop-blur"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
          >
            <ArrowUp size={18} />
          </motion.button>
        ) : null}
      </AnimatePresence>

      <nav
        aria-label="Quick actions"
        className="fixed inset-x-3 bottom-3 z-40 flex items-center rounded-full border border-line bg-bg/90 px-3 shadow-xl backdrop-blur-md"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <Link href="/#categories" className={item}>
          <LayoutGrid size={20} />
          {t.categories}
        </Link>
        <a
          href={waLink(WA_GREETING)}
          target="_blank"
          rel="noopener noreferrer"
          className="-my-3 grid size-14 shrink-0 place-items-center rounded-full bg-[#1f8f4e] text-white shadow-lg"
          aria-label={t.whatsapp}
        >
          <MessageCircle size={24} />
        </a>
        <Link href="/#deals" className={item}>
          <ShoppingBag size={20} />
          {t.shop}
        </Link>
      </nav>
    </div>
  );
}
