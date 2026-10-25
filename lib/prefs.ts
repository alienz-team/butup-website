import "server-only";
import { cookies } from "next/headers";
import { LANG_COOKIE, THEME_COOKIE, dict, type Lang, type Theme } from "@/lib/i18n";

export async function getPrefs() {
  const jar = await cookies();
  const lang: Lang = jar.get(LANG_COOKIE)?.value === "en" ? "en" : "ar";
  const theme: Theme = jar.get(THEME_COOKIE)?.value === "dark" ? "dark" : "light";
  return { lang, theme, t: dict[lang] };
}
