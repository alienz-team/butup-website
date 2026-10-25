import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/db";
import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  type CategoryDTO,
  type Color,
  type ProductDTO,
} from "@/lib/catalog";

type ProductRow = NonNullable<Awaited<ReturnType<NonNullable<typeof prisma>["product"]["findFirst"]>>>;

const toProduct = (r: ProductRow): ProductDTO => ({
  id: r.id,
  code: r.code,
  nameAr: r.nameAr,
  nameEn: r.nameEn,
  descAr: r.descAr,
  descEn: r.descEn,
  price: r.price,
  oldPrice: r.oldPrice,
  images: r.images,
  sizes: r.sizes,
  colors: Array.isArray(r.colors) ? (r.colors as unknown as Color[]) : [],
  stock: r.stock,
  featured: r.featured,
  active: r.active,
  categorySlug: r.categorySlug,
  subSlug: r.subSlug,
});

export type Catalog = { categories: CategoryDTO[]; products: ProductDTO[]; live: boolean };

/**
 * One batched round-trip for the whole storefront catalog. Any failure (no
 * DATABASE_URL, unreachable DB, empty tables) returns the seed data so the
 * site renders the same before and after the database is connected.
 */
export const getCatalog = cache(async (): Promise<Catalog> => {
  const fallback: Catalog = { categories: SEED_CATEGORIES, products: SEED_PRODUCTS, live: false };
  if (!prisma) return fallback;
  try {
    const [cats, subs, products] = await prisma.$transaction([
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.subCategory.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.product.findMany({ where: { active: true }, orderBy: [{ featured: "desc" }, { createdAt: "desc" }] }),
    ]);
    if (cats.length === 0) return fallback;
    return {
      live: true,
      categories: cats.map((c) => ({
        slug: c.slug,
        nameAr: c.nameAr,
        nameEn: c.nameEn,
        image: c.image,
        subs: subs.filter((s) => s.categorySlug === c.slug).map((s) => ({ slug: s.slug, nameAr: s.nameAr, nameEn: s.nameEn })),
      })),
      products: products.map(toProduct),
    };
  } catch (err) {
    console.error("getCatalog: falling back to seed data", err);
    return fallback;
  }
});

export type AdminData = {
  live: boolean;
  categories: CategoryDTO[];
  products: ProductDTO[];
  orders: {
    id: string;
    number: string;
    status: string;
    total: number;
    note: string | null;
    createdAt: Date;
    items: { id: string; productCode: string; productName: string; size: string | null; color: string | null; qty: number; unitPrice: number }[];
  }[];
};

/** Admin sees inactive products too and every order. */
export async function getAdminData(): Promise<AdminData> {
  if (!prisma) return { live: false, categories: SEED_CATEGORIES, products: SEED_PRODUCTS, orders: [] };
  try {
    const [cats, subs, products, orders] = await prisma.$transaction([
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.subCategory.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { items: true } }),
    ]);
    const categories = cats.length
      ? cats.map((c) => ({
          slug: c.slug, nameAr: c.nameAr, nameEn: c.nameEn, image: c.image,
          subs: subs.filter((s) => s.categorySlug === c.slug).map((s) => ({ slug: s.slug, nameAr: s.nameAr, nameEn: s.nameEn })),
        }))
      : SEED_CATEGORIES;
    return { live: true, categories, products: products.map(toProduct), orders };
  } catch (err) {
    console.error("getAdminData failed", err);
    return { live: false, categories: SEED_CATEGORIES, products: SEED_PRODUCTS, orders: [] };
  }
}
