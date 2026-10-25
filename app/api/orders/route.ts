import { randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 8;
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
 * Records an order intent when a shopper taps the WhatsApp button. Prices are
 * always re-read from the database, never taken from the client.
 */
export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const rawItems = (body as { items?: unknown })?.items;
  if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > 10) {
    return NextResponse.json({ error: "invalid_items" }, { status: 400 });
  }
  const items = rawItems.map((i) => ({
    code: text(i?.code, 32),
    qty: Math.min(10, Math.max(1, Math.trunc(Number(i?.qty)) || 1)),
    size: text(i?.size, 16) || null,
    color: text(i?.color, 32) || null,
  }));
  if (items.some((i) => !i.code)) return NextResponse.json({ error: "invalid_items" }, { status: 400 });

  // Without a database the WhatsApp message is the whole order; nothing to store.
  if (!prisma) return NextResponse.json({ ok: true, stored: false });

  try {
    const products = await prisma.product.findMany({
      where: { code: { in: items.map((i) => i.code) }, active: true },
    });
    const byCode = new Map(products.map((p) => [p.code, p]));
    const lines = items.flatMap((i) => {
      const p = byCode.get(i.code);
      return p
        ? [{ productId: p.id, productCode: p.code, productName: p.nameAr, size: i.size, color: i.color, qty: i.qty, unitPrice: p.price }]
        : [];
    });
    if (lines.length === 0) return NextResponse.json({ error: "unknown_product" }, { status: 404 });

    const d = new Date();
    const number = `BU-${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${randomInt(1000, 9999)}`;
    const total = lines.reduce((s, l) => s + l.qty * l.unitPrice, 0);

    await prisma.order.create({ data: { number, total, items: { create: lines } } });
    return NextResponse.json({ ok: true, stored: true, number });
  } catch (err) {
    console.error("order create failed", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
