import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { assertAdmin } from "@/lib/auth";
import type { CategoryDTO, ProductDTO } from "@/lib/catalog";
import { getAdminData, type AdminData, type AdminOrder } from "@/lib/store";
import { deleteProduct, logoutAction, saveProduct, setOrderStatus, updateStock } from "./actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const MESSAGES: Record<string, string> = {
  saved: "Saved.",
  deleted: "Product deleted.",
  no_db: "Connect DATABASE_URL to save changes. The store is showing seed data.",
  missing_fields: "Both titles, a category and a price are required.",
  need_image: "Add at least one image URL or upload a file.",
  upload_too_large: "Uploads must total 4 MB or less, up to 6 files.",
  save_failed: "Could not save. Check that the slug is unique.",
};

const STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];
const input = "w-full border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-fg";
const btn = "bg-fg px-5 py-2 text-sm text-bg";
const ghost = "border border-line px-4 py-2 text-sm hover:border-fg";
const money = (n: number) => `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(n)} LYD`;

type Tab = "dashboard" | "products" | "orders";
type Props = { searchParams: Promise<{ tab?: string; edit?: string; msg?: string }> };

export default async function AdminPage({ searchParams }: Props) {
  await assertAdmin();
  const { tab = "dashboard", edit, msg } = await searchParams;
  const data = await getAdminData();
  const active: Tab = tab === "orders" ? "orders" : tab === "products" ? "products" : "dashboard";
  const editing = edit === "new" ? null : data.products.find((p) => p.id === edit);
  const showForm = active === "products" && (edit === "new" || Boolean(editing));

  const navLink = (t: Tab, label: string) => (
    <Link href={`/admin?tab=${t}`} className={active === t ? btn : ghost}>
      {label}
    </Link>
  );

  return (
    <div dir="ltr" lang="en" className="mx-auto max-w-6xl px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="display text-4xl">Beautup admin</h1>
        <div className="flex gap-2">
          <Link href="/" className={ghost}>View store</Link>
          <form action={logoutAction}>
            <button className={ghost}>Sign out</button>
          </form>
        </div>
      </header>

      {!data.live ? (
        <p className="mt-4 border border-line bg-surface2 px-4 py-3 text-sm">
          No database connected. The store runs on built-in seed data and changes cannot be saved. Set DATABASE_URL and DIRECT_URL, then run <code>npm run db:push</code> and <code>npm run db:seed</code>.
        </p>
      ) : null}
      {msg ? <p role="status" className="mt-4 bg-surface2 px-4 py-3 text-sm">{MESSAGES[msg] ?? msg}</p> : null}

      <nav className="mt-6 flex gap-2" aria-label="Sections">
        {navLink("dashboard", "Dashboard")}
        {navLink("products", `Products (${data.products.length})`)}
        {navLink("orders", `Orders (${data.orders.length})`)}
      </nav>

      {active === "dashboard" ? (
        <Dashboard data={data} />
      ) : active === "orders" ? (
        <Orders orders={data.orders} />
      ) : showForm ? (
        <ProductForm product={editing ?? null} categories={data.categories} />
      ) : (
        <Products products={data.products} categories={data.categories} live={data.live} />
      )}
    </div>
  );
}

function Dashboard({ data }: { data: AdminData }) {
  const tiles = [
    ["Sales (confirmed and beyond)", money(data.stats.revenue)],
    ["Orders", String(data.stats.orderCount)],
    ["Pending orders", String(data.stats.pending)],
    ["Low stock (3 or fewer)", String(data.stats.lowStock)],
  ];
  return (
    <section className="mt-8">
      <dl className="grid grid-cols-2 gap-px bg-line md:grid-cols-4">
        {tiles.map(([label, value]) => (
          <div key={label} className="bg-bg p-5">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="display mt-2 text-4xl tabular-nums">{value}</dd>
          </div>
        ))}
      </dl>
      <h2 className="display mt-12 text-3xl">Recent orders</h2>
      {data.orders.length === 0 ? (
        <p className="mt-4 text-sm text-muted">No orders yet. They appear here when shoppers send a cart through checkout.</p>
      ) : (
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {data.orders.slice(0, 6).map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm">
              <span className="font-medium">{o.number}</span>
              <span className="text-muted">{o.customerName}</span>
              <span className="text-muted">{o.status}</span>
              <span className="tabular-nums">{money(o.totalAmount)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Products({ products, categories, live }: { products: ProductDTO[]; categories: CategoryDTO[]; live: boolean }) {
  const catName = (id: string) => categories.find((c) => c.id === id)?.nameEn ?? id;
  return (
    <section className="mt-6">
      <Link href="/admin?tab=products&edit=new" className={btn}>Add product</Link>
      <div className="mt-4 overflow-x-auto border border-line">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-surface2">
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
                    <span className="relative size-12 shrink-0 overflow-hidden bg-surface2">
                      <Image src={p.images[0]} alt="" fill sizes="48px" quality={75} className="object-cover" />
                    </span>
                    <span>
                      <span className="block font-medium">{p.titleEn}</span>
                      <span className="text-xs text-muted">{p.slug}{p.isActive ? "" : " | hidden"}</span>
                    </span>
                  </div>
                </td>
                <td className="p-3">{catName(p.categoryId)}</td>
                <td className="p-3 tabular-nums">{money(p.price)}</td>
                <td className="p-3">
                  <form action={updateStock} className="flex items-center gap-2">
                    <input type="hidden" name="id" value={p.id} />
                    <input name="stock" type="number" min={0} defaultValue={p.stock} className={`${input} !w-24`} aria-label={`Stock for ${p.titleEn}`} disabled={!live} />
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
      <h2 className="display text-3xl md:col-span-2">{p ? `Edit ${p.titleEn}` : "New product"}</h2>

      <label className="text-sm">Title (Arabic)<input name="titleAr" required dir="rtl" defaultValue={p?.titleAr} className={input} /></label>
      <label className="text-sm">Title (English)<input name="titleEn" required defaultValue={p?.titleEn} className={input} /></label>
      <label className="text-sm">Slug (leave empty to build from the English title)<input name="slug" defaultValue={p?.slug} className={input} dir="ltr" placeholder="denim-shirt-dress" /></label>
      <label className="text-sm">Stock<input name="stock" type="number" min={0} defaultValue={p?.stock ?? 0} className={input} /></label>
      <label className="text-sm">Description (Arabic)<textarea name="descriptionAr" rows={3} dir="rtl" defaultValue={p?.descriptionAr} className={input} /></label>
      <label className="text-sm">Description (English)<textarea name="descriptionEn" rows={3} defaultValue={p?.descriptionEn} className={input} /></label>
      <label className="text-sm">Price (LYD)<input name="price" type="number" min={0.01} step="0.01" required defaultValue={p?.price} className={input} /></label>
      <label className="text-sm">Compare-at price (LYD, optional)<input name="compareAtPrice" type="number" min={0} step="0.01" defaultValue={p?.compareAtPrice ?? ""} className={input} /></label>

      <label className="text-sm md:col-span-2">
        Category
        <select name="categoryId" required defaultValue={p?.categoryId ?? categories[0]?.id} className={input}>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.nameEn}</option>)}
        </select>
      </label>

      <label className="text-sm">Sizes (comma separated)<input name="sizes" defaultValue={p?.sizes.join(", ")} className={input} placeholder="S, M, L" /></label>
      <label className="text-sm">
        Colors (one per line: Arabic|English|#hex)
        <textarea name="colors" rows={3} defaultValue={colors} className={input} placeholder="ذهبي|Gold|#C9AA71" />
      </label>

      <label className="text-sm md:col-span-2">
        Image URLs (one per line; the first is the cover, the second shows on hover)
        <textarea name="imageUrls" rows={4} defaultValue={p?.images.join("\n")} className={input} dir="ltr" />
      </label>
      <label className="text-sm md:col-span-2">
        Upload images (JPEG, PNG or WebP, 4 MB total, up to 6)
        <input name="files" type="file" multiple accept="image/jpeg,image/png,image/webp" className={`${input} file:me-3 file:border-0 file:bg-surface2 file:px-4 file:py-1.5`} />
      </label>

      <div className="flex gap-6 text-sm md:col-span-2">
        <label className="flex items-center gap-2"><input type="checkbox" name="isFeatured" defaultChecked={p?.isFeatured ?? false} /> Featured on the home page</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="isActive" defaultChecked={p?.isActive ?? true} /> Visible in store</label>
      </div>

      <div className="flex gap-2 md:col-span-2">
        <button className={btn}>Save product</button>
        <Link href="/admin?tab=products" className={ghost}>Cancel</Link>
      </div>
    </form>
  );
}

function Orders({ orders }: { orders: AdminOrder[] }) {
  if (orders.length === 0) {
    return <p className="mt-10 text-center text-muted">No orders yet. They appear here when shoppers send a cart through checkout.</p>;
  }
  return (
    <ul className="mt-6 space-y-3">
      {orders.map((o) => (
        <li key={o.id} className="border border-line p-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-medium">{o.number}</p>
              <p className="text-xs text-muted">{o.createdAt.toISOString().slice(0, 16).replace("T", " ")} UTC</p>
            </div>
            <div className="text-sm">
              <p className="font-medium">{o.customerName}</p>
              <a href={`tel:${o.customerPhone}`} className="text-muted underline">{o.customerPhone}</a>
              <p className="max-w-xs text-muted">{o.address}</p>
            </div>
            <p className="display text-2xl tabular-nums">{money(o.totalAmount)}</p>
            <form action={setOrderStatus} className="flex items-center gap-2">
              <input type="hidden" name="id" value={o.id} />
              <select name="status" defaultValue={o.status} className={`${input} w-auto`} aria-label={`Status of ${o.number}`}>
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <button className={ghost}>Update</button>
            </form>
          </div>
          <ul className="mt-3 space-y-1 text-sm text-muted">
            {o.orderItems.map((i, n) => (
              <li key={`${i.slug}-${n}`}>
                {i.qty} x {i.title}{i.size ? ` | ${i.size}` : ""}{i.color ? ` | ${i.color}` : ""} | {money(i.unitPrice)}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
