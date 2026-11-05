"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { adminConfigured, assertAdmin, checkCredentials, createSession, destroySession } from "@/lib/auth";
import type { Color } from "@/lib/catalog";
import { prisma } from "@/lib/db";
import { MAX_FILES, MAX_UPLOAD_BYTES, isAllowedImageUrl, storeImage } from "@/lib/upload";

const ORDER_STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"] as const;

const str = (fd: FormData, k: string, max = 200) => String(fd.get(k) ?? "").trim().slice(0, max);
const int = (fd: FormData, k: string, min = 0, max = 1_000_000) => {
  const n = Math.trunc(Number(fd.get(k)));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
};
const back = (tab: string, msg?: string): never =>
  redirect(`/admin?tab=${tab}${msg ? `&msg=${encodeURIComponent(msg)}` : ""}`);

// Login throttle. Per server instance only, which is enough to slow down guessing.
let failures = 0;
let lockedUntil = 0;

export async function loginAction(_: string | null, fd: FormData): Promise<string | null> {
  if (!adminConfigured()) return "not_configured";
  if (Date.now() < lockedUntil) return "locked";
  const ok = await checkCredentials(str(fd, "email", 120), String(fd.get("password") ?? ""));
  if (!ok) {
    failures += 1;
    if (failures >= 5) {
      lockedUntil = Date.now() + 60_000;
      failures = 0;
    }
    return "wrong";
  }
  failures = 0;
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}

function parseColors(raw: string): Color[] {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, 12)
    .flatMap((line) => {
      const [ar, en, hex] = line.split("|").map((x) => x.trim());
      return ar && en && /^#[0-9a-fA-F]{6}$/.test(hex ?? "") ? [{ ar, en, hex }] : [];
    });
}

const num = (fd: FormData, k: string) => {
  const n = Number(fd.get(k));
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : 0;
};
const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);

export async function saveProduct(fd: FormData) {
  await assertAdmin();
  if (!prisma) return back("products", "no_db");

  const id = str(fd, "id", 40);
  const titleAr = str(fd, "titleAr", 120);
  const titleEn = str(fd, "titleEn", 120);
  const categoryId = str(fd, "categoryId", 40);
  const slug = slugify(str(fd, "slug", 80) || titleEn);
  const price = num(fd, "price");
  if (!titleAr || !titleEn || !categoryId || !slug || !price) return back("products", "missing_fields");

  const compareAtPrice = num(fd, "compareAtPrice");

  // Keep the URLs the admin pasted (host-checked), then append validated uploads.
  const images = str(fd, "imageUrls", 4000)
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && isAllowedImageUrl(l));

  const files = fd.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_FILES || files.reduce((s, f) => s + f.size, 0) > MAX_UPLOAD_BYTES) {
    return back("products", "upload_too_large");
  }
  try {
    for (const f of files) images.push(await storeImage(f));
  } catch (err) {
    return back("products", err instanceof Error ? err.message : "upload_failed");
  }
  if (images.length === 0) return back("products", "need_image");

  const data = {
    titleAr,
    titleEn,
    slug,
    descriptionAr: str(fd, "descriptionAr", 1500),
    descriptionEn: str(fd, "descriptionEn", 1500),
    price,
    compareAtPrice: compareAtPrice > price ? compareAtPrice : null,
    stock: int(fd, "stock"),
    isFeatured: fd.get("isFeatured") === "on",
    isActive: fd.get("isActive") === "on",
    categoryId,
    images: images.slice(0, 10),
    sizes: str(fd, "sizes", 200).split(",").map((s) => s.trim()).filter(Boolean).slice(0, 12),
    colors: parseColors(str(fd, "colors", 1200)) as unknown as object,
  };

  try {
    if (id) await prisma.product.update({ where: { id }, data });
    else await prisma.product.create({ data });
  } catch (err) {
    console.error("saveProduct failed", err);
    return back("products", "save_failed");
  }
  revalidatePath("/", "layout");
  return back("products", "saved");
}

export async function updateStock(fd: FormData) {
  await assertAdmin();
  const id = str(fd, "id", 40);
  if (!prisma || !id) return back("products");
  await prisma.product.update({ where: { id }, data: { stock: int(fd, "stock") } });
  revalidatePath("/", "layout");
  return back("products", "saved");
}

export async function deleteProduct(fd: FormData) {
  await assertAdmin();
  const id = str(fd, "id", 40);
  if (!prisma || !id) return back("products");
  await prisma.product.delete({ where: { id } });
  revalidatePath("/", "layout");
  return back("products", "deleted");
}

export async function setOrderStatus(fd: FormData) {
  await assertAdmin();
  const id = str(fd, "id", 40);
  const status = ORDER_STATUSES.find((s) => s === fd.get("status"));
  if (!prisma || !id || !status) return back("orders");
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
  return back("orders", "saved");
}
