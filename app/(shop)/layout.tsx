import CartDrawer from "@/components/CartDrawer";
import CartProvider from "@/components/CartProvider";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getPrefs } from "@/lib/prefs";
import { getCatalog } from "@/lib/store";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const { lang, theme } = await getPrefs();
  const { categories } = await getCatalog();
  return (
    <CartProvider>
      <Navbar lang={lang} theme={theme} categories={categories} />
      <main>{children}</main>
      <Footer lang={lang} categories={categories} />
      <CartDrawer lang={lang} />
    </CartProvider>
  );
}
