import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

export const ADMIN_COOKIE = "bu_admin";
const SESSION_SECONDS = 60 * 60 * 8;

function secret(): string | null {
  const s = process.env.ADMIN_SESSION_SECRET;
  return s && s.length >= 16 ? s : null;
}

export const adminConfigured = () => Boolean(secret() && (process.env.ADMIN_PASSWORD || prisma));

const sign = (payload: string, key: string) => createHmac("sha256", key).update(payload).digest("hex");

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

/**
 * Admin credentials: a database User with role ADMIN, or the bootstrap
 * ADMIN_PASSWORD env var (used before the database has any users).
 */
export async function checkCredentials(email: string, password: string): Promise<boolean> {
  if (prisma && email) {
    try {
      const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
      if (user && user.role === "ADMIN" && verifyPassword(password, user.passwordHash)) return true;
    } catch (err) {
      console.error("admin login lookup failed", err);
    }
  }
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  // Hash both sides so the comparison length never leaks the password length.
  const h = (v: string) => createHmac("sha256", "bu-pw").update(v).digest("hex");
  return safeEqual(h(password), h(expected));
}

export async function createSession() {
  const key = secret();
  if (!key) throw new Error("ADMIN_SESSION_SECRET is not configured");
  const exp = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `ADMIN.${exp}`;
  (await cookies()).set(ADMIN_COOKIE, `${payload}.${sign(payload, key)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function destroySession() {
  (await cookies()).delete(ADMIN_COOKIE);
}

export async function isAdmin(): Promise<boolean> {
  const key = secret();
  if (!key) return false;
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!value) return false;
  const [role, exp, sig] = value.split(".");
  if (role !== "ADMIN" || !exp || !sig) return false;
  if (!safeEqual(sig, sign(`${role}.${exp}`, key))) return false;
  return Number(exp) > Math.floor(Date.now() / 1000);
}

/** Gate for the admin pages and every admin server action. */
export async function assertAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/login");
}
