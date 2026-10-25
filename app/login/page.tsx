import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { isAdmin } from "@/lib/auth";
import { getPrefs } from "@/lib/prefs";

export const metadata: Metadata = { title: "Login", robots: { index: false, follow: false } };

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");
  const { lang, t } = await getPrefs();
  return (
    <main className="grid min-h-dvh place-items-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-display text-4xl font-medium">{t.login.title}</h1>
        <p className="mt-2 text-sm text-muted">{t.login.hint}</p>
        <LoginForm lang={lang} />
        <Link href="/" className="mt-6 block text-center text-sm text-muted underline underline-offset-4 hover:text-fg">
          {t.category.back}
        </Link>
      </div>
    </main>
  );
}
