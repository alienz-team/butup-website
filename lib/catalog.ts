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
};

/** Picks the Arabic or English field of any bilingual record (`title`, `name`, `description`). */
export function pick<T extends Record<string, unknown>>(o: T, base: string, lang: "ar" | "en"): string {
  const key = `${base}${lang === "ar" ? "Ar" : "En"}`;
  return String(o[key] ?? "");
}

export const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;



// Photography style: editorial fashion models and lifestyle portraits for clothing and accessories,
// clean product shots for bags and fragrance. Every id below was opened and checked by eye.
export const PHOTO = {
  // Models
  scarfKimono: "1752074210484-768a39e3c033",
  silkBlouse: "1770294758906-c8762abb2c8b",
  knitSweater: "1759229874914-c1ffdb3ebd0c",
  beigeAbaya: "1760083545495-b297b1690672",
  coatStairs: "1762605135012-56a59a059e60",
  camelCoatHat: "1653875842174-429c1b467548",
  blackMaxi: "1668028554553-f83cac89ce0f",
  creamBlazer: "1571513722275-4b41940f54b8",
  goldNecklace: "1589713680561-1d0b6945a582",
  // Products and flat lays
  bootsFlatlay: "1516762689617-e1cffcef479d",
  bagLeather: "1590874103328-eac38a683ce7",
  bagSatchel: "1605733513597-a8f8341084e6",
  perfumeGold: "1588405748880-12d1d2a59f75",
  perfumeOrange: "1615634260167-c8cdede054de",
  skincareDisplay: "1596462502278-27bfdc403348",
  skincareFlatlay: "1612817288484-6f916006741a",
  skincareTube: "1608248543803-ba4f8c70ae0b",
  makeupMarble: "1522335789203-aabd1fc54bc9",
  heels: "1535043934128-cf0b28d52f95",
  hoops: "1617038220319-276d3cfab638",
  pearls: "1515562141207-7a88fb7ce338",
  crystal: "1573408301185-9146fe634ad0",
} as const;

export const HERO_IMAGES = [img(PHOTO.coatStairs, 2400), img(PHOTO.blackMaxi, 2400), img(PHOTO.creamBlazer, 2400)];

export const SEED_CATEGORIES: CategoryDTO[] = [
  { id: "cat_clothing", slug: "clothing", nameAr: "ملابس", nameEn: "Clothing", image: img(PHOTO.camelCoatHat) },
  { id: "cat_shoes_bags", slug: "shoes-bags", nameAr: "أحذية وحقائب", nameEn: "Shoes & Bags", image: img(PHOTO.goldNecklace) },
  { id: "cat_beauty", slug: "beauty", nameAr: "التجميل والعطور", nameEn: "Beauty & Perfumes", image: img(PHOTO.perfumeGold) },
];

const SIZES = ["S", "M", "L", "XL"];
const NEUTRALS: Color[] = [
  { ar: "أسود", en: "Black", hex: "#1A1A1A" },
  { ar: "بيج", en: "Sand", hex: "#CDBFA9" },
];

type Seed = Omit<ProductDTO, "isActive" | "images"> & { photos: (keyof typeof PHOTO)[] };

const SEEDS: Seed[] = [
  {
    id: "p_beige-knit-sweater", slug: "beige-knit-sweater", categoryId: "cat_clothing",
    titleAr: "كنزة تريكو بيج", titleEn: "Beige Knit Sweater",
    descriptionAr: "كنزة من التريكو الناعم بقصة مريحة ولون بيج هادئ، تناسب الإطلالات اليومية.",
    descriptionEn: "A soft knit sweater in a quiet beige with a relaxed fit, made for everyday elegance.",
    price: 185, compareAtPrice: 220, sizes: SIZES, colors: [{ ar: "بيج", en: "Sand", hex: "#CDBFA9" }], stock: 14, isFeatured: true,
    photos: ["knitSweater", "silkBlouse", "camelCoatHat"],
  },
  {
    id: "p_silk-sleeveless-blouse", slug: "silk-sleeveless-blouse", categoryId: "cat_clothing",
    titleAr: "بلوزة حرير بلا أكمام", titleEn: "Silk Sleeveless Blouse",
    descriptionAr: "بلوزة من الحرير الناعم بياقة كلاسيكية وأزرار لؤلؤية، قطعة أساسية لكل خزانة.",
    descriptionEn: "A fluid silk blouse with a classic collar and pearl buttons, a wardrobe essential.",
    price: 210, compareAtPrice: null, sizes: SIZES, colors: [{ ar: "عاجي", en: "Ivory", hex: "#F3EFE6" }], stock: 18, isFeatured: true,
    photos: ["silkBlouse", "creamBlazer", "knitSweater"],
  },
  {
    id: "p_black-maxi-dress", slug: "black-maxi-dress", categoryId: "cat_clothing",
    titleAr: "فستان ماكسي أسود", titleEn: "Black Maxi Dress",
    descriptionAr: "فستان طويل بأكمام واسعة وقماش منساب، إطلالة سهرة محتشمة وراقية.",
    descriptionEn: "A floor-length dress with full sleeves and a fluid drape, a modest and refined evening look.",
    price: 360, compareAtPrice: null, sizes: SIZES, colors: [{ ar: "أسود", en: "Black", hex: "#1A1A1A" }], stock: 8, isFeatured: true,
    photos: ["blackMaxi", "scarfKimono", "beigeAbaya"],
  },
  {
    id: "p_cream-tuxedo-blazer", slug: "cream-tuxedo-blazer", categoryId: "cat_clothing",
    titleAr: "بليزر كريمي بياقة ساتان", titleEn: "Cream Tuxedo Blazer",
    descriptionAr: "بليزر بقصة مهيكلة ولون كريمي وياقة بتفاصيل ساتان، للمناسبات والعمل.",
    descriptionEn: "A structured blazer in cream with a contrast lapel, for occasions and the office.",
    price: 320, compareAtPrice: 380, sizes: SIZES, colors: [{ ar: "كريمي", en: "Cream", hex: "#EFE6D2" }], stock: 10, isFeatured: false,
    photos: ["creamBlazer", "silkBlouse", "coatStairs"],
  },
  {
    id: "p_embroidered-beige-abaya", slug: "embroidered-beige-abaya", categoryId: "cat_clothing",
    titleAr: "عباية بيج مطرزة", titleEn: "Embroidered Beige Abaya",
    descriptionAr: "عباية بقصة واسعة منسدلة وتطريز ناعم على الأكمام والخصر مع حزام.",
    descriptionEn: "A flowing abaya with soft embroidery at the sleeves and waist, finished with a belt.",
    price: 410, compareAtPrice: null, sizes: ["52", "54", "56", "58"], colors: [{ ar: "بيج", en: "Sand", hex: "#E3CBB8" }], stock: 12, isFeatured: true,
    photos: ["beigeAbaya", "coatStairs", "scarfKimono"],
  },
  {
    id: "p_taupe-belted-abaya", slug: "taupe-belted-abaya", categoryId: "cat_clothing",
    titleAr: "عباية مفتوحة بحزام", titleEn: "Taupe Belted Abaya",
    descriptionAr: "عباية مفتوحة بلون ترابي وحزام رفيع وأكمام بتفاصيل أنيقة.",
    descriptionEn: "An open-front abaya in taupe with a slim belt and finely detailed sleeves.",
    price: 395, compareAtPrice: 450, sizes: ["52", "54", "56", "58"], colors: [{ ar: "ترابي", en: "Taupe", hex: "#A38A72" }], stock: 9, isFeatured: false,
    photos: ["coatStairs", "beigeAbaya", "camelCoatHat"],
  },
  {
    id: "p_camel-wool-coat", slug: "camel-wool-coat", categoryId: "cat_clothing",
    titleAr: "معطف صوف جملي", titleEn: "Camel Wool Coat",
    descriptionAr: "معطف طويل من الصوف بلون جملي كلاسيكي، دافئ وخفيف على الكتفين.",
    descriptionEn: "A long wool coat in classic camel, warm yet light on the shoulders.",
    price: 480, compareAtPrice: null, sizes: SIZES, colors: [{ ar: "جملي", en: "Camel", hex: "#C19A6B" }], stock: 7, isFeatured: false,
    photos: ["camelCoatHat", "knitSweater", "coatStairs"],
  },
  {
    id: "p_gold-layered-necklace", slug: "gold-layered-necklace", categoryId: "cat_shoes_bags",
    titleAr: "عقد ذهبي متعدد الطبقات", titleEn: "Gold Layered Necklace",
    descriptionAr: "عقدان رفيعان بلمعة ذهبية ناعمة يُلبسان معاً أو منفصلين.",
    descriptionEn: "Two fine gold chains that layer together or stand alone.",
    price: 130, compareAtPrice: 160, sizes: [], colors: [{ ar: "ذهبي", en: "Gold", hex: "#C9AA71" }], stock: 25, isFeatured: true,
    photos: ["goldNecklace", "hoops", "pearls"],
  },
  {
    id: "p_structured-leather-bag", slug: "structured-leather-bag", categoryId: "cat_shoes_bags",
    titleAr: "حقيبة جلدية مهيكلة", titleEn: "Structured Leather Bag",
    descriptionAr: "حقيبة يد بجلد مهيكل وبطانة داخلية ناعمة، بتفاصيل ذهبية هادئة.",
    descriptionEn: "A structured leather handbag with a soft lining and quiet gold hardware.",
    price: 340, compareAtPrice: null, sizes: [], colors: [{ ar: "بني", en: "Tan", hex: "#8A5A36" }, { ar: "أسود", en: "Black", hex: "#1A1A1A" }], stock: 9, isFeatured: true,
    photos: ["bagLeather", "bagSatchel", "bootsFlatlay"],
  },
  {
    id: "p_everyday-satchel", slug: "everyday-satchel", categoryId: "cat_shoes_bags",
    titleAr: "حقيبة ساتشل يومية", titleEn: "Everyday Satchel",
    descriptionAr: "حقيبة كتف عملية بمساحة واسعة وقفل معدني، لكل يوم.",
    descriptionEn: "A practical shoulder satchel with generous space and a metal clasp, for every day.",
    price: 285, compareAtPrice: 320, sizes: [], colors: NEUTRALS, stock: 12, isFeatured: false,
    photos: ["bagSatchel", "bagLeather", "pearls"],
  },
  {
    id: "p_suede-heeled-boots", slug: "suede-heeled-boots", categoryId: "cat_shoes_bags",
    titleAr: "بوت كعب سويدي", titleEn: "Suede Heeled Boots",
    descriptionAr: "بوت قصير من السويد بكعب متوسط ولون جملي يناسب الشتاء.",
    descriptionEn: "Short suede boots with a mid heel in a camel tone, made for cooler days.",
    price: 270, compareAtPrice: null, sizes: ["37", "38", "39", "40"], colors: [{ ar: "جملي", en: "Camel", hex: "#C19A6B" }], stock: 10, isFeatured: false,
    photos: ["bootsFlatlay", "heels", "bagLeather"],
  },
  {
    id: "p_amber-oud-perfume", slug: "amber-oud-perfume", categoryId: "cat_beauty",
    titleAr: "عطر العنبر والعود", titleEn: "Amber & Oud Perfume",
    descriptionAr: "عطر شرقي دافئ بقلب من العنبر والعود وخاتمة ناعمة من الفانيلا.",
    descriptionEn: "A warm Eastern fragrance with an amber and oud heart and a soft vanilla finish.",
    price: 320, compareAtPrice: 380, sizes: ["50ml", "100ml"], colors: [], stock: 18, isFeatured: true,
    photos: ["perfumeGold", "perfumeOrange", "crystal"],
  },
  {
    id: "p_citrus-musk-perfume", slug: "citrus-musk-perfume", categoryId: "cat_beauty",
    titleAr: "عطر الحمضيات والمسك", titleEn: "Citrus Musk Perfume",
    descriptionAr: "عطر منعش يجمع الحمضيات اللامعة مع مسك نظيف يدوم.",
    descriptionEn: "A fresh scent pairing bright citrus with a clean, lasting musk.",
    price: 280, compareAtPrice: null, sizes: ["50ml", "100ml"], colors: [], stock: 22, isFeatured: false,
    photos: ["perfumeOrange", "perfumeGold", "makeupMarble"],
  },
  {
    id: "p_daily-skincare-set", slug: "daily-skincare-set", categoryId: "cat_beauty",
    titleAr: "مجموعة العناية اليومية بالبشرة", titleEn: "Daily Skincare Set",
    descriptionAr: "مجموعة من ثلاث خطوات لترطيب البشرة وإشراقتها كل يوم.",
    descriptionEn: "A three-step routine for hydrated, glowing skin every day.",
    price: 230, compareAtPrice: 270, sizes: [], colors: [], stock: 25, isFeatured: false,
    photos: ["skincareDisplay", "skincareFlatlay", "skincareTube"],
  },
];

export const SEED_PRODUCTS: ProductDTO[] = SEEDS.map(({ photos, ...p }) => ({
  ...p,
  isActive: true,
  images: photos.map((k) => img(PHOTO[k])),
}));
