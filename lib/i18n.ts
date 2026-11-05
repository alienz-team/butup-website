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
  /** Phone shown in the original site's header and contact section. */
  sitePhone: "+218--0910073418",
  siteEmail: "butupbrand@gmail.com",
  lat: 32.8872094,
  lng: 13.1913383,
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

export const dict = {
  ar: {
    brand: "بيوت أب - Beautup",
    nav: { home: "الرئيسية", contact: "الاتصال", cart: "السلة", menu: "القائمة", login: "تسجيل الدخول" },
    toggles: { lang: "English", toDark: "الوضع الداكن", toLight: "الوضع الفاتح" },
    hero: {
      title: "buTup",
      sub: "بيوت اب بــرانـد ليبــي بدأت مشـوارهــا عــام 2017 لتقــدم افضـل وأجــود انـواع المــلابس وصيحـات الموضـة المستوحــاة من الفخامــة الشرقيـة لتكوني أنيقـة دائمـا .",
    },
    sections: { categories: "الفـئـــات", quick: "تســوق سريـــع", contact: "الاتصال" },
    count: "المنتجات",
    quickView: "استعراض سريع",
    category: { empty: "لا توجد منتجات في هذه الفئة حالياً.", home: "الرئيسية" },
    product: { qty: "الكمية", size: "المقاس", color: "اللون", add: "أضف إلى السلة", chooseSize: "اختر المقاس أولاً", out: "غير متوفر حالياً", related: "منتجات متعلقة" },
    cart: {
      title: "السلة",
      empty: "السلة فارغة.",
      browse: "تابع التسوق",
      subtotal: "المجموع",
      checkout: "إتمام الطلب",
      name: "الاسم",
      phone: "الهاتف",
      address: "العنوان",
      place: "إرسال الطلب عبر واتساب",
      placing: "جارٍ إرسال الطلب...",
      remove: "إزالة",
      back: "العودة للسلة",
      error: "تعذّر إرسال الطلب. تأكد من البيانات وحاول مجدداً.",
      close: "إغلاق",
      decrease: "إنقاص الكمية",
      increase: "زيادة الكمية",
    },
    contact: { name: "الاسم", phone: "الهاتف", email: "البريد الإلكتروني", message: "الرسالة", send: "اتصل بنا", address: "طرابلس، ليبيا", email_value: "butupbrand@gmail.com" },
    footer: { rights: "حقوق النشر © {year} جميع الحقوق محفوظة" },
    login: {
      title: "تسجيل الدخول",
      hint: "أدخل بياناتك للوصول إلى لوحة التحكم.",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      submit: "تسجيل الدخول",
      pending: "جارٍ الدخول...",
      wrong: "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
      locked: "محاولات كثيرة. انتظر دقيقة ثم حاول مجدداً.",
      not_configured: "لم يتم إعداد الدخول بعد. أضف ADMIN_SESSION_SECRET و ADMIN_PASSWORD في البيئة.",
      failed: "تعذّر تسجيل الدخول.",
    },
  },
  en: {
    brand: "Beautup",
    nav: { home: "Home", contact: "Contact", cart: "Cart", menu: "Menu", login: "Login" },
    toggles: { lang: "العربية", toDark: "Dark mode", toLight: "Light mode" },
    hero: {
      title: "buTup",
      sub: "Beautup is a Libyan brand that began in 2017, bringing you the finest clothing and fashion trends inspired by Eastern luxury, so you are always elegant.",
    },
    sections: { categories: "Categories", quick: "Fast Deals", contact: "Contact" },
    count: "products",
    quickView: "Quick view",
    category: { empty: "There are no products in this category yet.", home: "Home" },
    product: { qty: "Quantity", size: "Size", color: "Color", add: "Add to cart", chooseSize: "Choose a size first", out: "Currently unavailable", related: "More products" },
    cart: {
      title: "Cart",
      empty: "Your cart is empty.",
      browse: "Continue shopping",
      subtotal: "Subtotal",
      checkout: "Checkout",
      name: "Name",
      phone: "Phone",
      address: "Address",
      place: "Send order on WhatsApp",
      placing: "Sending your order...",
      remove: "Remove",
      back: "Back to cart",
      error: "We could not send your order. Check your details and try again.",
      close: "Close",
      decrease: "Decrease quantity",
      increase: "Increase quantity",
    },
    contact: { name: "Name", phone: "Phone", email: "Email", message: "Message", send: "Contact us", address: "Tripoli, Libya", email_value: "butupbrand@gmail.com" },
    footer: { rights: "Copyright © {year} All rights reserved" },
    login: {
      title: "Login",
      hint: "Enter your details to open the dashboard.",
      email: "Email",
      password: "Password",
      submit: "Login",
      pending: "Signing in...",
      wrong: "Wrong email or password.",
      locked: "Too many attempts. Wait a minute and try again.",
      not_configured: "Login is not set up yet. Add ADMIN_SESSION_SECRET and ADMIN_PASSWORD to the environment.",
      failed: "Sign-in failed.",
    },
  },
} as const;
