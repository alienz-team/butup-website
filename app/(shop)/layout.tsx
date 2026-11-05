import CartDrawer from "@/components/CartDrawer";
import CartProvider from "@/components/CartProvider";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getPrefs } from "@/lib/prefs";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const { lang, theme } = await getPrefs();
  return (
    <CartProvider>
      <Navbar lang={lang} theme={theme} />
      <main>{children}</main>
      <Footer lang={lang} />
      <CartDrawer lang={lang} />
    </CartProvider>
  );
}
