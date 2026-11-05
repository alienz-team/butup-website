import { randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { SEED_PRODUCTS } from "@/lib/catalog";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/**
 * Creates a PENDING order from the cart checkout form. Prices are always re-read
 * from the catalog, never taken from the client.
 */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const customerName = text(body.customerName, 80);
  const customerPhone = text(body.customerPhone, 24);
  const address = text(body.address, 300);
  if (!customerName || !/^[+\d][\d\s-]{6,22}$/.test(customerPhone) || !address) {
    return NextResponse.json({ error: "invalid_customer" }, { status: 400 });
  }

  const rawItems = body.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > 20) {
    return NextResponse.json({ error: "invalid_items" }, { status: 400 });
  }
  const items = rawItems.map((i: Record<string, unknown>) => ({
    slug: text(i?.slug, 80),
    qty: Math.min(10, Math.max(1, Math.trunc(Number(i?.qty)) || 1)),
    size: text(i?.size, 16) || null,
    color: text(i?.color, 32) || null,
  }));
  if (items.some((i) => !i.slug)) return NextResponse.json({ error: "invalid_items" }, { status: 400 });

  try {
    const slugs = items.map((i) => i.slug);
    const products = prisma
      ? await prisma.product.findMany({ where: { slug: { in: slugs }, isActive: true } })
      : SEED_PRODUCTS.filter((p) => slugs.includes(p.slug));
    const bySlug = new Map(products.map((p) => [p.slug, p]));
    const lines = items.flatMap((i) => {
      const p = bySlug.get(i.slug);
      return p
        ? [{ productId: p.id, slug: p.slug, title: p.titleEn, size: i.size, color: i.color, qty: i.qty, unitPrice: p.price }]
        : [];
    });
    if (lines.length === 0) return NextResponse.json({ error: "unknown_product" }, { status: 404 });

    const d = new Date();
    const number = `BU-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${randomInt(1000, 9999)}`;
    const totalAmount = lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);

    // Without a database the WhatsApp message is the whole order; nothing is stored.
    if (prisma) {
      await prisma.order.create({ data: { number, customerName, customerPhone, address, totalAmount, orderItems: lines } });
    }
    return NextResponse.json({ ok: true, stored: Boolean(prisma), number, totalAmount });
  } catch (err) {
    console.error("order create failed", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
