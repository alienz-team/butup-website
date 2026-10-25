export type Color = { ar: string; en: string; hex: string };

export type ProductDTO = {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  price: number;
  oldPrice: number | null;
  images: string[];
  sizes: string[];
  colors: Color[];
  stock: number;
  featured: boolean;
  active: boolean;
  categorySlug: string;
  subSlug: string | null;
};

export type SubCategoryDTO = { slug: string; nameAr: string; nameEn: string };
export type CategoryDTO = {
  slug: string;
  nameAr: string;
  nameEn: string;
  image: string;
  subs: SubCategoryDTO[];
};

export const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=85`;

// Every id below was opened and checked by eye. Several ids from the brief were wrong
// (404, a wine bottle, a floral shoe, branded Chanel bottles) so they are replaced with
// unbranded equivalents.
export const PHOTO = {
  denimDress: "1591369822096-ffd140ec948f",
  maroonDress: "1585487000160-6ebcfceb0d03",
  blushTrousers: "1594633312681-425c7b97ccd1",
  clothesRail: "1490481651871-ab68de25d43d",
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

export const SEED_CATEGORIES: CategoryDTO[] = [
  {
    slug: "clothing",
    nameAr: "ملابس",
    nameEn: "Clothing",
    image: img(PHOTO.denimDress),
    subs: [
      { slug: "dresses", nameAr: "فساتين", nameEn: "Dresses" },
      { slug: "lingerie", nameAr: "ملابس داخلية", nameEn: "Lingerie" },
    ],
  },
  {
    slug: "shoes-bags",
    nameAr: "أحذية وحقائب",
    nameEn: "Shoes & Bags",
    image: img(PHOTO.bagLeather),
    subs: [
      { slug: "shoes", nameAr: "أحذية", nameEn: "Shoes" },
      { slug: "bags", nameAr: "حقائب", nameEn: "Bags" },
    ],
  },
  {
    slug: "beauty",
    nameAr: "التجميل والعطور",
    nameEn: "Beauty & Perfumes",
    image: img(PHOTO.skincareDisplay),
    subs: [
      { slug: "skincare", nameAr: "التجميل والعناية بالبشرة", nameEn: "Skincare" },
      { slug: "perfumes", nameAr: "العطور", nameEn: "Perfumes" },
    ],
  },
  {
    slug: "accessories",
    nameAr: "اكسسوارات",
    nameEn: "Accessories",
    image: img(PHOTO.pearls),
    subs: [],
  },
];

const C = {
  black: { ar: "أسود", en: "Black", hex: "#1A1A1A" },
  ivory: { ar: "عاجي", en: "Ivory", hex: "#F3EBDD" },
  blush: { ar: "وردي فاتح", en: "Blush", hex: "#E8C9C0" },
  gold: { ar: "ذهبي", en: "Gold", hex: "#C9AA71" },
  wine: { ar: "عنابي", en: "Wine", hex: "#6E1F34" },
  navy: { ar: "كحلي", en: "Navy", hex: "#1F2A44" },
  tan: { ar: "جملي", en: "Tan", hex: "#B5834F" },
  nude: { ar: "بيج", en: "Nude", hex: "#D9BFA4" },
  denim: { ar: "أزرق جينز", en: "Denim", hex: "#6F8FB3" },
};

type Seed = Omit<ProductDTO, "id" | "active" | "images"> & { photos: string[] };

const seed = ({ photos, ...rest }: Seed): ProductDTO => ({
  ...rest,
  id: rest.code,
  active: true,
  images: photos.map((p) => img(p)),
});

export const SEED_PRODUCTS: ProductDTO[] = [
  seed({
    code: "BU-1001", nameAr: "ملابس داخلية 3 قطع", nameEn: "Lingerie set, 3 pieces",
    descAr: "طقم ملابس داخلية ناعم من قماش قطني مريح، ثلاث قطع بألوان هادئة.",
    descEn: "A soft cotton lingerie set of three pieces in quiet tones.",
    price: 70, oldPrice: null, photos: [PHOTO.blushTrousers, PHOTO.clothesRail],
    sizes: ["S", "M", "L", "XL"], colors: [C.blush, C.ivory, C.black], stock: 40, featured: true,
    categorySlug: "clothing", subSlug: "lingerie",
  }),
  seed({
    code: "BU-1002", nameAr: "ملابس داخلية 7 قطع", nameEn: "Lingerie set, 7 pieces",
    descAr: "عرض التوفير: سبع قطع من الملابس الداخلية القطنية لكل يوم من الأسبوع.",
    descEn: "The value pack: seven cotton pieces, one for every day of the week.",
    price: 100, oldPrice: 140, photos: [PHOTO.clothesRail, PHOTO.blushTrousers],
    sizes: ["S", "M", "L", "XL"], colors: [C.nude, C.black], stock: 25, featured: true,
    categorySlug: "clothing", subSlug: "lingerie",
  }),
  seed({
    code: "BU-1003", nameAr: "فستان جينز بأزرار", nameEn: "Buttoned denim dress",
    descAr: "فستان بقصة واسعة وأزرار أمامية، مريح للنهار ويسهل تنسيقه لإطلالة محتشمة.",
    descEn: "A relaxed button-front dress for daytime, easy to layer for a modest look.",
    price: 185, oldPrice: 220, photos: [PHOTO.denimDress, PHOTO.maroonDress],
    sizes: ["S", "M", "L", "XL"], colors: [C.denim], stock: 14, featured: true,
    categorySlug: "clothing", subSlug: "dresses",
  }),
  seed({
    code: "BU-1004", nameAr: "فستان قطيفة عنابي", nameEn: "Wine corduroy dress",
    descAr: "فستان طويل بأكمام كاملة من قماش قطيفة ناعم، بلون عنابي دافئ.",
    descEn: "A full-length corduroy dress with long sleeves in a warm wine shade.",
    price: 240, oldPrice: null, photos: [PHOTO.maroonDress, PHOTO.denimDress],
    sizes: ["S", "M", "L"], colors: [C.wine, C.navy], stock: 9, featured: true,
    categorySlug: "clothing", subSlug: "dresses",
  }),
  seed({
    code: "BU-1005", nameAr: "بنطال واسع ناعم", nameEn: "Soft wide-leg trousers",
    descAr: "بنطال بقماش ناعم الملمس وقصة واسعة مع شريط مطاطي عند الكاحل.",
    descEn: "Soft-drape trousers with a wide cut and gathered ankle.",
    price: 130, oldPrice: null, photos: [PHOTO.blushTrousers],
    sizes: ["S", "M", "L"], colors: [C.blush, C.ivory], stock: 18, featured: false,
    categorySlug: "clothing", subSlug: "dresses",
  }),
  seed({
    code: "BU-2001", nameAr: "حقيبة يد مضفرة", nameEn: "Woven top-handle bag",
    descAr: "حقيبة يد مضفرة بمقبض علوي وغطاء من الجلد الصناعي، خفيفة وأنيقة للنهار.",
    descEn: "A woven top-handle bag with a vegan-leather flap, light and elegant for daytime.",
    price: 320, oldPrice: 380, photos: [PHOTO.bagLeather],
    sizes: [], colors: [C.tan], stock: 8, featured: true,
    categorySlug: "shoes-bags", subSlug: "bags",
  }),
  seed({
    code: "BU-2002", nameAr: "حقيبة ساتشل جلدية", nameEn: "Leather satchel bag",
    descAr: "حقيبة ساتشل بإغلاق مزدوج وحزام كتف قابل للتعديل، تتسع لأغراضك اليومية.",
    descEn: "A satchel with double buckle closure and an adjustable strap for everyday essentials.",
    price: 280, oldPrice: null, photos: [PHOTO.bagSatchel],
    sizes: [], colors: [{ ar: "رمادي", en: "Grey", hex: "#8A8A8E" }], stock: 12, featured: true,
    categorySlug: "shoes-bags", subSlug: "bags",
  }),
  seed({
    code: "BU-2004", nameAr: "حذاء كعب كلاسيكي", nameEn: "Classic pointed heels",
    descAr: "حذاء بكعب متوسط ومقدمة مدببة بلون عاجي يناسب كل الإطلالات.",
    descEn: "Mid-height pointed pumps in ivory that go with every look.",
    price: 195, oldPrice: null, photos: [PHOTO.heels],
    sizes: ["36", "37", "38", "39", "40", "41"], colors: [C.ivory, C.black], stock: 20, featured: true,
    categorySlug: "shoes-bags", subSlug: "shoes",
  }),
  seed({
    code: "BU-3001", nameAr: "عطر عود وعنبر", nameEn: "Oud & amber eau de parfum",
    descAr: "عطر شرقي دافئ بنوتات العود والعنبر والفانيلا، ثبات يدوم طوال اليوم.",
    descEn: "A warm Eastern fragrance of oud, amber and vanilla with all-day wear.",
    price: 260, oldPrice: 310, photos: [PHOTO.perfumeGold, PHOTO.perfumeOrange],
    sizes: ["50ml", "100ml"], colors: [], stock: 22, featured: true,
    categorySlug: "beauty", subSlug: "perfumes",
  }),
  seed({
    code: "BU-3002", nameAr: "عطر زهري برتقالي", nameEn: "Orange blossom eau de parfum",
    descAr: "عطر زهري منعش بنفحات الحمضيات وزهر البرتقال.",
    descEn: "A fresh floral with citrus and orange blossom.",
    price: 230, oldPrice: null, photos: [PHOTO.perfumeOrange],
    sizes: ["50ml", "100ml"], colors: [], stock: 16, featured: false,
    categorySlug: "beauty", subSlug: "perfumes",
  }),
  seed({
    code: "BU-3003", nameAr: "مجموعة العناية بالبشرة", nameEn: "Daily skincare set",
    descAr: "مجموعة عناية يومية بتركيبات لطيفة: منظف، سيروم وكريم مرطب.",
    descEn: "A gentle daily routine: cleanser, serum and moisturiser.",
    price: 150, oldPrice: 180, photos: [PHOTO.skincareFlatlay, PHOTO.skincareTube],
    sizes: [], colors: [], stock: 30, featured: true,
    categorySlug: "beauty", subSlug: "skincare",
  }),
  seed({
    code: "BU-3004", nameAr: "باليت مكياج", nameEn: "Makeup essentials palette",
    descAr: "باليت ألوان ترابية مع بودرة وأحمر خدود لإطلالة ناعمة.",
    descEn: "Earthy shades with powder and blush for a soft finish.",
    price: 120, oldPrice: null, photos: [PHOTO.makeupMarble, PHOTO.skincareDisplay],
    sizes: [], colors: [], stock: 3, featured: false,
    categorySlug: "beauty", subSlug: "skincare",
  }),
  seed({
    code: "BU-4001", nameAr: "حلق ذهبي دائري", nameEn: "Gold chunky hoops",
    descAr: "حلق دائري بتصميم ملتوي مطلي بالذهب، خفيف ولا يسبب حساسية.",
    descEn: "Twisted gold-plated hoops, lightweight and skin-friendly.",
    price: 65, oldPrice: null, photos: [PHOTO.hoops, PHOTO.crystal],
    sizes: [], colors: [C.gold], stock: 35, featured: true,
    categorySlug: "accessories", subSlug: null,
  }),
  seed({
    code: "BU-4002", nameAr: "عقد لؤلؤ", nameEn: "Pearl necklace",
    descAr: "عقد لؤلؤ كلاسيكي بقفل ذهبي، يضيف لمسة راقية لأي إطلالة.",
    descEn: "A classic pearl strand with a gold clasp.",
    price: 110, oldPrice: 140, photos: [PHOTO.pearls, PHOTO.crystal],
    sizes: [], colors: [C.ivory], stock: 11, featured: true,
    categorySlug: "accessories", subSlug: null,
  }),
];

export const pick = (item: { nameAr: string; nameEn: string }, lang: "ar" | "en") =>
  lang === "ar" ? item.nameAr : item.nameEn;
