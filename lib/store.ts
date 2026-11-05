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
  slug: r.slug,
  titleAr: r.titleAr,
  titleEn: r.titleEn,
  descriptionAr: r.descriptionAr,
  descriptionEn: r.descriptionEn,
  price: r.price,
  compareAtPrice: r.compareAtPrice,
  images: r.images,
  sizes: r.sizes,
  colors: Array.isArray(r.colors) ? (r.colors as unknown as Color[]) : [],
  categoryId: r.categoryId,
  isFeatured: r.isFeatured,
  isActive: r.isActive,
  stock: r.stock,
});

export type Catalog = { categories: CategoryDTO[]; products: ProductDTO[]; live: boolean };

/**
 * One sequential round-trip for the whole storefront catalog (never Promise.all against the pooler).
 * Any failure (no DATABASE_URL, unreachable DB, empty tables) returns the seed data so the site
 * renders the same before and after the database is connected.
 */
export const getCatalog = cache(async (): Promise<Catalog> => {
  const fallback: Catalog = { categories: SEED_CATEGORIES, products: SEED_PRODUCTS, live: false };
  if (!prisma) return fallback;
  try {
    const [cats, products] = await prisma.$transaction([
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.product.findMany({ where: { isActive: true }, orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }] }),
    ]);
    if (cats.length === 0) return fallback;
    return {
      live: true,
      categories: cats.map(({ sortOrder: _s, ...c }) => c),
      products: products.map(toProduct),
    };
  } catch (err) {
    console.error("getCatalog: falling back to seed data", err);
    return fallback;
  }
});

export type OrderLine = {
  productId: string;
  slug: string;
  title: string;
  size: string | null;
  color: string | null;
  qty: number;
  unitPrice: number;
};

export type AdminOrder = {
  id: string;
  number: string;
  status: string;
  customerName: string;
  customerPhone: string;
  address: string;
  totalAmount: number;
  createdAt: Date;
  orderItems: OrderLine[];
};

export type AdminData = {
  live: boolean;
  categories: CategoryDTO[];
  products: ProductDTO[];
  orders: AdminOrder[];
  stats: { revenue: number; orderCount: number; pending: number; lowStock: number };
};

const emptyStats = { revenue: 0, orderCount: 0, pending: 0, lowStock: 0 };

/** Admin sees inactive products too and every order. */
export async function getAdminData(): Promise<AdminData> {
  const fallback: AdminData = { live: false, categories: SEED_CATEGORIES, products: SEED_PRODUCTS, orders: [], stats: emptyStats };
  if (!prisma) return fallback;
  try {
    const [cats, products, orders] = await prisma.$transaction([
      prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
      prisma.product.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
      prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 200 }),
    ]);
    const list: AdminOrder[] = orders.map((o) => ({
      id: o.id,
      number: o.number,
      status: o.status,
      customerName: o.customerName,
      customerPhone: o.customerPhone,
      address: o.address,
      totalAmount: o.totalAmount,
      createdAt: o.createdAt,
      orderItems: Array.isArray(o.orderItems) ? (o.orderItems as unknown as OrderLine[]) : [],
    }));
    return {
      live: true,
      categories: cats.length ? cats.map(({ sortOrder: _s, ...c }) => c) : SEED_CATEGORIES,
      products: products.map(toProduct),
      orders: list,
      stats: {
        revenue: list.filter((o) => o.status !== "PENDING").reduce((s, o) => s + o.totalAmount, 0),
        orderCount: list.length,
        pending: list.filter((o) => o.status === "PENDING").length,
        lowStock: products.filter((p) => p.stock <= 3).length,
      },
    };
  } catch (err) {
    console.error("getAdminData failed", err);
    return fallback;
  }
}
