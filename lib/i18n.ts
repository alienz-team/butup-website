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

export function waLink(message: string) {
  return `https://wa.me/${CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const WA_GREETING = "أهلاً بيوت أب (Beautup)، أود الاستفسار عن منتجاتكم.";

export const formatPrice = (n: number, lang: Lang) =>
  `${new Intl.NumberFormat(lang === "ar" ? "ar-LY-u-nu-latn" : "en-US", { maximumFractionDigits: 2 }).format(n)} ${lang === "ar" ? "د.ل" : "LYD"}`;

export const dict = {
  ar: {
    brand: "بيوت أب",
    nav: { shop: "المتجر", categories: "الأقسام", story: "قصتنا", contact: "تواصل معنا", login: "دخول", menu: "القائمة", search: "بحث", cart: "السلة" },
    toggles: { lang: "English", toDark: "الوضع الداكن", toLight: "الوضع الفاتح" },
    hero: {
      line: "أزياء وجمال ليبي بروح شرقية",
      sub: "منذ 2017، نختار الأقمشة والعطور والتفاصيل التي تبقى معك.",
      cta: "تسوقي الآن",
    },
    featured: { title: "مختارات الموسم", all: "كل المنتجات" },
    categories: { title: "تسوقي حسب القسم", open: "عرض القسم" },
    story: {
      title: "علامة ليبية تعرف معنى الأناقة",
      body: "بيوت اب براند ليبي بدأت مشوارها عام 2017 لتقدم أفضل وأجود أنواع الملابس وصيحات الموضة المستوحاة من الفخامة الشرقية لتكوني أنيقة دائماً.",
    },
    shop: {
      title: "المتجر",
      all: "الكل",
      empty: "لا توجد منتجات مطابقة. جرّبي قسماً آخر أو كلمة بحث مختلفة.",
      count: "منتج",
      searchPlaceholder: "ابحثي عن منتج",
      searchGo: "بحث",
      close: "إغلاق",
    },
    product: {
      size: "المقاس",
      color: "اللون",
      add: "أضيفي إلى السلة",
      added: "تمت الإضافة",
      chooseSize: "اختاري المقاس أولاً",
      out: "غير متوفر حالياً",
      low: "كمية محدودة",
      inStock: "متوفر",
      related: "قد يعجبك أيضاً",
      back: "المتجر",
      details: "التفاصيل",
    },
    cart: {
      title: "السلة",
      empty: "سلتك فارغة. ابدئي بإضافة قطعة تحبينها.",
      browse: "تصفحي المتجر",
      subtotal: "المجموع",
      checkout: "إتمام الطلب",
      name: "الاسم الكامل",
      phone: "رقم الهاتف",
      address: "العنوان",
      place: "أرسلي الطلب عبر واتساب",
      placing: "جارٍ إرسال الطلب...",
      remove: "إزالة",
      back: "العودة للسلة",
      error: "تعذّر إرسال الطلب. تأكدي من البيانات وحاولي مجدداً.",
      close: "إغلاق السلة",
      decrease: "إنقاص الكمية",
      increase: "زيادة الكمية",
      note: "سنفتح واتساب لتأكيد طلبك معنا.",
    },
    footer: { follow: "تابعينا", rights: "جميع الحقوق محفوظة" },
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
    nav: { shop: "Shop", categories: "Categories", story: "Our story", contact: "Contact", login: "Login", menu: "Menu", search: "Search", cart: "Cart" },
    toggles: { lang: "العربية", toDark: "Dark mode", toLight: "Light mode" },
    hero: {
      line: "Libyan fashion and beauty, with an Eastern soul",
      sub: "Since 2017, we choose the fabrics, scents and details that stay with you.",
      cta: "Shop now",
    },
    featured: { title: "Featured collection", all: "All products" },
    categories: { title: "Shop by category", open: "View category" },
    story: {
      title: "A Libyan label that knows elegance",
      body: "Beautup is a Libyan brand that began in 2017, bringing you the finest clothing and fashion trends inspired by Eastern luxury, so you are always elegant.",
    },
    shop: {
      title: "Shop",
      all: "All",
      empty: "No products match. Try another category or a different search.",
      count: "products",
      searchPlaceholder: "Search for a product",
      searchGo: "Search",
      close: "Close",
    },
    product: {
      size: "Size",
      color: "Color",
      add: "Add to cart",
      added: "Added to cart",
      chooseSize: "Choose a size first",
      out: "Currently unavailable",
      low: "Limited stock",
      inStock: "In stock",
      related: "You may also like",
      back: "Shop",
      details: "Details",
    },
    cart: {
      title: "Cart",
      empty: "Your cart is empty. Start with a piece you love.",
      browse: "Browse the shop",
      subtotal: "Subtotal",
      checkout: "Checkout",
      name: "Full name",
      phone: "Phone number",
      address: "Address",
      place: "Send order on WhatsApp",
      placing: "Sending your order...",
      remove: "Remove",
      back: "Back to cart",
      error: "We could not send your order. Check your details and try again.",
      close: "Close cart",
      decrease: "Decrease quantity",
      increase: "Increase quantity",
      note: "WhatsApp opens so we can confirm your order.",
    },
    footer: { follow: "Follow us", rights: "All rights reserved" },
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
