import { HOME_ORDER, ORIGINAL_ROWS } from "./original-catalog";

export type Color = { ar: string; en: string; hex: string };

export type ProductDTO = {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  sizes: string[];
  colors: Color[];
  categoryId: string;
  isFeatured: boolean;
  isActive: boolean;
  stock: number;
};

export type CategoryDTO = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  image: string;
  parentId: string | null;
};

/** Picks the Arabic or English field of any bilingual record (`title`, `name`, `description`). */
export function pick<T extends Record<string, unknown>>(o: T, base: string, lang: "ar" | "en"): string {
  const key = `${base}${lang === "ar" ? "Ar" : "En"}`;
  return String(o[key] ?? "");
}

/** Arabic prices on the original store read "70ل.د" (no space). */
export const money = (n: number, lang: "ar" | "en" = "ar") =>
  lang === "ar" ? `${Number.isInteger(n) ? n : n.toFixed(2)}ل.د` : `${Number.isInteger(n) ? n : n.toFixed(2)} LYD`;

// ---------------------------------------------------------------------------
// Content copied from https://64d4c512933fc.site123.me/ : the same categories (including the
// stretched-letter spelling used in the menu), product names, prices and photos.
// ---------------------------------------------------------------------------
const UP = "https://images.cdn-files-a.com/uploads/8410793";
const MEDIA = "https://images.cdn-files-a.com/ready_uploads/media";

export const HERO_IMAGES = [
  `${MEDIA}/8900825/2000_6373f3039b134.jpg`,
  `${MEDIA}/2815502/2000_5e07d4abb9813.jpg`,
  `${UP}/2000_64e1f6599c968_filter_64e1f65a92134.jpg`,
  `${MEDIA}/15458/2000_5cdadee9aaee8.jpg`,
  `${MEDIA}/8926925/2000_6374422515626.jpg`,
];

export const SEED_CATEGORIES: CategoryDTO[] = [
  { id: "cat_clothing", slug: "clothing", nameAr: "ملابـــس", nameEn: "Clothing", image: `${MEDIA}/6098072/800_5f2db5cf10e66.jpg`, parentId: null },
  { id: "cat_dresses", slug: "dresses", nameAr: "فســاتيــن", nameEn: "Dresses", image: `${MEDIA}/6098072/800_5f2db5cf10e66.jpg`, parentId: "cat_clothing" },
  { id: "cat_underwear", slug: "underwear", nameAr: "ملابـس داخلــية", nameEn: "Underwear", image: `${MEDIA}/6098072/800_5f2db5cf10e66.jpg`, parentId: "cat_clothing" },
  { id: "cat_shoes_bags", slug: "shoes-bags", nameAr: "احديـــة وحقـــائب", nameEn: "Shoes & Bags", image: `${MEDIA}/123616/800_5ce940f507e56.jpg`, parentId: null },
  { id: "cat_shoes", slug: "shoes", nameAr: "احديــة", nameEn: "Shoes", image: `${MEDIA}/123616/800_5ce940f507e56.jpg`, parentId: "cat_shoes_bags" },
  { id: "cat_bags", slug: "bags", nameAr: "حقــائـب", nameEn: "Bags", image: `${MEDIA}/123616/800_5ce940f507e56.jpg`, parentId: "cat_shoes_bags" },
  { id: "cat_beauty", slug: "beauty", nameAr: "التجميـــل والعطــور", nameEn: "Beauty & Perfumes", image: `${MEDIA}/6378848/800_5f51fa92db9e4.jpg`, parentId: null },
  { id: "cat_skincare", slug: "skincare", nameAr: "التجميــل والعـنايــة بالبشــرة", nameEn: "Makeup & Skincare", image: `${MEDIA}/6378848/800_5f51fa92db9e4.jpg`, parentId: "cat_beauty" },
  { id: "cat_perfumes", slug: "perfumes", nameAr: "العطــور", nameEn: "Perfumes", image: `${MEDIA}/6378848/800_5f51fa92db9e4.jpg`, parentId: "cat_beauty" },
  { id: "cat_accessories", slug: "accessories", nameAr: "اكسســوارات واضافــات", nameEn: "Accessories & Extras", image: `${MEDIA}/2824744/800_5e18ecae4e759.jpg`, parentId: null },
];

const CAT_ID: Record<string, string> = { dresses: "cat_dresses", underwear: "cat_underwear", bags: "cat_bags", accessories: "cat_accessories" };

/** Every product on the original store, in the order its category pages list them. */
export const SEED_PRODUCTS: (ProductDTO & { sortOrder: number })[] = ORIGINAL_ROWS.map(([id, title, price, before, cat, imgs], n) => ({
  id: `p_${id}`,
  slug: `p-${id}`,
  titleAr: title,
  // The original store is Arabic-only, so the English title mirrors it until an admin translates it.
  titleEn: title,
  descriptionAr: "",
  descriptionEn: "",
  price,
  compareAtPrice: before,
  images: imgs.map((p) => `https://images.cdn-files-a.com/${p}`),
  sizes: [],
  colors: [],
  categoryId: CAT_ID[cat],
  isFeatured: HOME_ORDER.includes(id),
  isActive: true,
  stock: 20,
  sortOrder: n,
}));

/** The home page "تسوق سريع" row: featured products in the order the original shows them. */
export const homeProducts = (products: ProductDTO[]) =>
  products
    .filter((p) => p.isFeatured)
    .sort((a, b) => HOME_ORDER.findIndex((id) => a.slug === `p-${id}`) - HOME_ORDER.findIndex((id) => b.slug === `p-${id}`));
