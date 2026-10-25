export type Lang = "ar" | "en";
export type Theme = "light" | "dark";

export const LANG_COOKIE = "bu_lang";
export const THEME_COOKIE = "bu_theme";

export const LOGO_URL = "https://images.cdn-files-a.com/uploads/8410793/400_filter_nobg_64ee1506c22a2.png";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://putup.store";

const digits = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "218915229703").replace(/\D/g, "");

export const CONTACT = {
  whatsappNumber: digits,
  whatsappDisplay: "+218-91-5229703",
  instagram: "https://www.instagram.com/beaut_up",
  instagramHandle: "beaut_up",
  facebook:
    process.env.NEXT_PUBLIC_FACEBOOK_URL ||
    "https://www.facebook.com/search/pages?q=" + encodeURIComponent("Beautup _ بيوت أب"),
  facebookName: "Beautup _ بيوت أب",
  domain: "Putup.store",
};

/** Without a configured number, wa.me opens a chat picker so the link still works. */
export function waLink(message: string) {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const WA_GREETING = "أهلاً بيوت أب (Beautup)، أود الاستفسار عن منتجاتكم.";

export function productMessage(p: { name: string; code: string; price: number }, extra: string[] = []) {
  const base = `أهلاً بيوت أب (Beautup)، أود طلب هذا المنتج: ${p.name} (كود: ${p.code}) - السعر: ${p.price} LYD`;
  return extra.length ? `${base}\n${extra.join("\n")}` : base;
}

export const dict = {
  ar: {
    brand: "بيوت أب",
    nav: { home: "الرئيسية", categories: "الأقسام", deals: "تسوق سريع", story: "قصتنا", contact: "تواصل معنا", login: "تسجيل الدخول" },
    toggles: { lang: "English", toDark: "الوضع الداكن", toLight: "الوضع الفاتح" },
    hero: {
      title: "buTup",
      subtitle: "بيوت اب براند ليبي بدأت مشوارها عام 2017 لتقدم أفضل وأجود أنواع الملابس وصيحات الموضة المستوحاة من الفخامة الشرقية لتكوني أنيقة دائماً.",
      alt: "بيوت أب",
      cta: "تسوقي الآن",
      cta2: "تصفحي الأقسام",
    },
    story: {
      since: "منذ 2017",
      title: "علامة ليبية تعرف معنى الأناقة",
      body: "بيوت اب براند ليبي بدأت مشوارها عام 2017 لتقدم أفضل وأجود أنواع الملابس وصيحات الموضة المستوحاة من الفخامة الشرقية لتكوني أنيقة دائماً.",
    },
    categories: { title: "تسوقي حسب القسم", hint: "أربعة أقسام، كل ما تحتاجينه في مكان واحد", open: "عرض القسم" },
    deals: { title: "تســوق سريـــع", hint: "وصل حديثاً وأسعار مختارة. اطلبي مباشرة عبر واتساب.", all: "كل المنتجات" },
    product: {
      quick: "استعراض سريع",
      size: "المقاس",
      color: "اللون",
      qty: "الكمية",
      order: "اطلبي عبر واتساب",
      code: "كود",
      inStock: "متوفر",
      low: "كمية محدودة",
      out: "غير متوفر حالياً",
      close: "إغلاق",
    },
    category: { all: "الكل", empty: "لا توجد منتجات في هذا القسم حالياً.", back: "الرئيسية" },
    footer: { follow: "تابعينا", rights: "جميع الحقوق محفوظة" },
    dock: { whatsapp: "واتساب", shop: "تسوق", categories: "الأقسام", top: "للأعلى", login: "دخول" },
    login: {
      title: "تسجيل الدخول",
      hint: "أدخلي بياناتك للوصول إلى لوحة التحكم.",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      submit: "تسجيل الدخول",
      pending: "جارٍ الدخول...",
      close: "إغلاق",
      page: "فتح صفحة الدخول",
      wrong: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
      locked: "محاولات كثيرة. انتظري دقيقة ثم حاولي مجدداً.",
      not_configured: "لم يتم إعداد الدخول بعد. أضيفي ADMIN_SESSION_SECRET و ADMIN_PASSWORD في البيئة.",
      failed: "تعذّر تسجيل الدخول.",
    },
  },
  en: {
    brand: "Beautup",
    nav: { home: "Home", categories: "Categories", deals: "Fast Deals", story: "Our story", contact: "Contact", login: "Login" },
    toggles: { lang: "العربية", toDark: "Dark mode", toLight: "Light mode" },
    hero: {
      title: "buTup",
      subtitle: "Beautup is a Libyan brand that began in 2017, bringing you the finest clothing and fashion trends inspired by Eastern luxury, so you are always elegant.",
      alt: "Beautup",
      cta: "Shop now",
      cta2: "Browse categories",
    },
    story: {
      since: "Since 2017",
      title: "A Libyan label that knows elegance",
      body: "Beautup is a Libyan brand that began in 2017, bringing you the finest clothing and fashion trends inspired by Eastern luxury, so you are always elegant.",
    },
    categories: { title: "Shop by category", hint: "Four departments, everything in one place", open: "View category" },
    deals: { title: "Fast Deals", hint: "New arrivals and selected prices. Order directly on WhatsApp.", all: "All products" },
    product: {
      quick: "Quick shop",
      size: "Size",
      color: "Color",
      qty: "Quantity",
      order: "Order on WhatsApp",
      code: "Code",
      inStock: "In stock",
      low: "Limited stock",
      out: "Currently unavailable",
      close: "Close",
    },
    category: { all: "All", empty: "There are no products in this category yet.", back: "Home" },
    footer: { follow: "Follow us", rights: "All rights reserved" },
    dock: { whatsapp: "WhatsApp", shop: "Shop", categories: "Categories", top: "Top", login: "Login" },
    login: {
      title: "Login",
      hint: "Enter your details to open the dashboard.",
      email: "Email",
      password: "Password",
      submit: "Login",
      pending: "Signing in...",
      close: "Close",
      page: "Open login page",
      wrong: "Wrong email or password.",
      locked: "Too many attempts. Wait a minute and try again.",
      not_configured: "Login is not set up yet. Add ADMIN_SESSION_SECRET and ADMIN_PASSWORD to the environment.",
      failed: "Sign-in failed.",
    },
  },
} as const;

export type Dict = (typeof dict)["ar"];
