import "server-only";
import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
export const MAX_FILES = 6;

/** Hosts the storefront is allowed to render images from (mirrors next.config.ts). */
const ALLOWED_HOST = /^(images\.unsplash\.com|images\.cdn-files-a\.com|[a-z0-9-]+\.public\.blob\.vercel-storage\.com)$/;

export function isAllowedImageUrl(value: string): boolean {
  if (value.startsWith("/uploads/") && !value.includes("..")) return true;
  try {
    const u = new URL(value);
    return u.protocol === "https:" && ALLOWED_HOST.test(u.hostname);
  } catch {
    return false;
  }
}

/** Identify the real format from magic bytes instead of trusting the browser's MIME type. */
function sniff(buf: Buffer): "jpg" | "png" | "webp" | null {
  if (buf.length > 12 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpg";
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.length > 12 && buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP") return "webp";
  return null;
}

const CONTENT_TYPE = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" } as const;

/** Stores one validated image and returns its public URL. Throws a user-facing Error. */
export async function storeImage(file: File): Promise<string> {
  if (file.size > MAX_UPLOAD_BYTES) throw new Error("Image is larger than 4 MB");
  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniff(buf);
  if (!kind) throw new Error("Only JPEG, PNG or WebP images are allowed");
  const name = `products/${Date.now()}-${randomBytes(6).toString("hex")}.${kind}`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(name, buf, { access: "public", contentType: CONTENT_TYPE[kind] });
    return blob.url;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("Image uploads need BLOB_READ_WRITE_TOKEN (Vercel Blob). Paste an image URL instead.");
  }
  const dir = path.join(process.cwd(), "public", "uploads", "products");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(process.cwd(), "public", "uploads", name), buf);
  return `/uploads/${name}`;
}
