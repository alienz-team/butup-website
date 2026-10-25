import type { Metadata, Viewport } from "next";
import { Amiri, Cormorant_Garamond, IBM_Plex_Sans_Arabic } from "next/font/google";
import { cookies } from "next/headers";
import { LANG_COOKIE, LOGO_URL, SITE_URL, THEME_COOKIE, type Lang, type Theme } from "@/lib/i18n";
import "./globals.css";

const plex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});
const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Beautup | بيوت أب", template: "%s | Beautup | بيوت أب" },
  description:
    "بيوت أب: براند ليبي منذ 2017 للملابس والأحذية والحقائب والتجميل والعطور والإكسسوارات. Beautup, a Libyan fashion and beauty label since 2017.",
  icons: { icon: LOGO_URL, apple: LOGO_URL },
  openGraph: {
    title: "Beautup | بيوت أب",
    description: "Libyan fashion and beauty, inspired by Eastern luxury.",
    url: SITE_URL,
    images: [{ url: LOGO_URL }],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#fdfbf7" },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const lang: Lang = jar.get(LANG_COOKIE)?.value === "en" ? "en" : "ar";
  const theme: Theme = jar.get(THEME_COOKIE)?.value === "dark" ? "dark" : "light";

  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`${plex.variable} ${cormorant.variable} ${amiri.variable} ${theme === "dark" ? "dark" : ""}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
