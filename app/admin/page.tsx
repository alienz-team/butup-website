import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { assertAdmin } from "@/lib/auth";
import type { CategoryDTO, ProductDTO } from "@/lib/catalog";
import { getAdminData, type AdminData } from "@/lib/store";
import { deleteProduct, logoutAction, saveProduct, setOrderStatus, updateStock } from "./actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const MESSAGES: Record<string, string> = {
  saved: "Saved.",
  deleted: "Product deleted.",
  no_db: "Connect DATABASE_URL to save changes. The store is showing seed data.",
  missing_fields: "Code, both names and a category are required.",
  need_image: "Add at least one image URL or upload a file.",
  upload_too_large: "Uploads must total 4 MB or less, up to 6 files.",
  save_failed: "Could not save. Check that the product code is unique.",
};

const STATUSES = ["NEW", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
const input = "w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-gold";
const btn = "rounded-full bg-gold px-5 py-2 text-sm font-medium text-on-gold";
const ghost = "rounded-full border border-line px-4 py-2 text-sm hover:border-gold";

type Props = { searchParams: Promise<{ tab?: string; edit?: string; msg?: string }> };

export default async function AdminPage({ searchParams }: Props) {
  await assertAdmin();
  const [{ tab = "products", edit, msg }, data] = await Promise.all([searchParams, getAdminData()]);
  const active = tab === "orders" ? "orders" : "products";
  const editing = edit === "new" ? null : data.products.find((p) => p.id === edit);
  const showForm = edit === "new" || Boolean(editing);

  return (
    <div dir="ltr" lang="en" className="mx-auto max-w-6xl px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-4xl font-medium">Beautup admin</h1>
        <div className="flex gap-2">
          <Link href="/" className={ghost}>View store</Link>
          <form action={logoutAction}>
            <button className={ghost}>Sign out</button>
          </form>
        </div>
      </header>

      {!data.live ? (
        <p className="mt-4 rounded-lg border border-gold/60 bg-blush px-4 py-3 text-sm">
          No database connected. The store runs on built-in seed data and changes cannot be saved. Set DATABASE_URL and DIRECT_URL, then run <code>npm run db:push</code> and <code>npm run db:seed</code>.
        </p>
      ) : null}
      {msg ? (
        <p role="status" className="mt-4 rounded-lg bg-surface2 px-4 py-3 text-sm">{MESSAGES[msg] ?? msg}</p>
      ) : null}

      <nav className="mt-6 flex gap-2" aria-label="Sections">
        <Link href="/admin?tab=products" className={active === "products" ? btn : ghost}>Products ({data.products.length})</Link>
        <Link href="/admin?tab=orders" className={active === "orders" ? btn : ghost}>Orders ({data.orders.length})</Link>
      </nav>

      {active === "orders" ? (
        <Orders orders={data.orders} />
      ) : showForm ? (
        <ProductForm product={editing ?? null} categories={data.categories} />
      ) : (
        <Products products={data.products} categories={data.categories} live={data.live} />
      )}
    </div>
  );
}

function Products({ products, categories, live }: { products: ProductDTO[]; categories: CategoryDTO[]; live: boolean }) {
  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.nameEn ?? slug;
  return (
    <section className="mt-6">
      <Link href="/admin?tab=products&edit=new" className={btn}>Add product</Link>
      <div className="mt-4 overflow-x-auto rounded-xl border border-line">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-surface2 text-start">
            <tr>
              <th className="p-3 text-start font-medium">Product</th>
              <th className="p-3 text-start font-medium">Category</th>
              <th className="p-3 text-start font-medium">Price</th>
              <th className="p-3 text-start font-medium">Stock</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-line align-middle">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-surface2">
                      <Image src={p.images[0]} alt="" fill sizes="48px" quality={75} className="object-cover" />
                    </span>
                    <span>
                      <span className="block font-medium">{p.nameEn}</span>
                      <span className="text-xs text-muted">{p.code}{p.active ? "" : " | hidden"}</span>
                    </span>
                  </div>
                </td>
                <td className="p-3">{catName(p.categorySlug)}</td>
                <td className="p-3">{p.price} LYD</td>
                <td className="p-3">
                  <form action={updateStock} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={p.id} />
                    <input name="stock" type="number" min={0} defaultValue={p.stock} className={`${input} !w-24`} aria-label={`Stock for ${p.nameEn}`} disabled={!live} />
                    <button className={ghost} disabled={!live}>Update</button>
                  </form>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin?tab=products&edit=${p.id}`} className={ghost}>Edit</Link>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button className={`${ghost} text-red-600`} disabled={!live}>Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function ProductForm({ product: p, categories }: { product: ProductDTO | null; categories: CategoryDTO[] }) {
  const colors = p?.colors.map((c) => `${c.ar}|${c.en}|${c.hex}`).join("\n") ?? "";
  return (
    <form action={saveProduct} className="mt-6 grid gap-4 md:grid-cols-2" encType="multipart/form-data">
      <input type="hidden" name="id" value={p?.id ?? ""} />
      <h2 className="font-display text-3xl md:col-span-2">{p ? `Edit ${p.nameEn}` : "New product"}</h2>

      <label className="text-sm">Code<input name="code" required defaultValue={p?.code} className={input} placeholder="BU-1006" /></label>
      <label className="text-sm">Stock<input name="stock" type="number" min={0} defaultValue={p?.stock ?? 0} className={input} /></label>
      <label className="text-sm">Name (Arabic)<input name="nameAr" required dir="rtl" defaultValue={p?.nameAr} className={input} /></label>
      <label className="text-sm">Name (English)<input name="nameEn" required defaultValue={p?.nameEn} className={input} /></label>
      <label className="text-sm">Description (Arabic)<textarea name="descAr" rows={3} dir="rtl" defaultValue={p?.descAr} className={input} /></label>
      <label className="text-sm">Description (English)<textarea name="descEn" rows={3} defaultValue={p?.descEn} className={input} /></label>
      <label className="text-sm">Price (LYD)<input name="price" type="number" min={1} required defaultValue={p?.price} className={input} /></label>
      <label className="text-sm">Old price (LYD, optional)<input name="oldPrice" type="number" min={0} defaultValue={p?.oldPrice ?? ""} className={input} /></label>

      <label className="text-sm">
        Category
        <select name="categorySlug" required defaultValue={p?.categorySlug ?? categories[0]?.slug} className={input}>
          {categories.map((c) => <option key={c.slug} value={c.slug}>{c.nameEn}</option>)}
        </select>
      </label>
      <label className="text-sm">
        Sub-category
        <select name="subSlug" defaultValue={p?.subSlug ?? ""} className={input}>
          <option value="">None</option>
          {categories.flatMap((c) => c.subs.map((s) => <option key={s.slug} value={s.slug}>{c.nameEn}: {s.nameEn}</option>))}
        </select>
      </label>

      <label className="text-sm">Sizes (comma separated)<input name="sizes" defaultValue={p?.sizes.join(", ")} className={input} placeholder="S, M, L" /></label>
      <label className="text-sm">
        Colors (one per line: Arabic|English|#hex)
        <textarea name="colors" rows={3} defaultValue={colors} className={input} placeholder="ذهبي|Gold|#C9AA71" />
      </label>

      <label className="text-sm md:col-span-2">
        Image URLs (one per line; Unsplash, the Beautup CDN or Vercel Blob)
        <textarea name="imageUrls" rows={4} defaultValue={p?.images.join("\n")} className={input} dir="ltr" />
      </label>
      <label className="text-sm md:col-span-2">
        Upload images (JPEG, PNG or WebP, 4 MB total, up to 6)
        <input name="files" type="file" multiple accept="image/jpeg,image/png,image/webp" className={`${input} file:me-3 file:rounded-full file:border-0 file:bg-surface2 file:px-4 file:py-1.5`} />
      </label>

      <div className="flex gap-6 text-sm md:col-span-2">
        <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={p?.featured ?? false} /> Show in Fast Deals</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={p?.active ?? true} /> Visible in store</label>
      </div>

      <div className="flex gap-2 md:col-span-2">
        <button className={btn}>Save product</button>
        <Link href="/admin?tab=products" className={ghost}>Cancel</Link>
      </div>
    </form>
  );
}

function Orders({ orders }: { orders: AdminData["orders"] }) {
  if (orders.length === 0) {
    return <p className="mt-10 text-center text-muted">No orders yet. They appear here when shoppers tap the WhatsApp order button.</p>;
  }
  return (
    <ul className="mt-6 space-y-3">
      {orders.map((o) => (
        <li key={o.id} className="rounded-xl border border-line p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-medium">{o.number}</p>
              <p className="text-xs text-muted">{o.createdAt.toISOString().slice(0, 16).replace("T", " ")} UTC</p>
            </div>
            <p className="font-display text-xl">{o.total} LYD</p>
            <form action={setOrderStatus} className="flex items-center gap-2">
              <input type="hidden" name="id" value={o.id} />
              <select name="status" defaultValue={o.status} className={`${input} w-auto`} aria-label={`Status of ${o.number}`}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <button className={ghost}>Update</button>
            </form>
          </div>
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {o.items.map((i) => (
              <li key={i.id}>
                {i.qty} x {i.productName} ({i.productCode}){i.size ? ` | ${i.size}` : ""}{i.color ? ` | ${i.color}` : ""} | {i.unitPrice} LYD
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
