import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getDict, getLocale } from "@/lib/i18n";
import { getSessionUser } from "@/lib/auth/rbac";
import { getCartItemCount } from "@/lib/cart/queries";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, dict, user, cartCount] = await Promise.all([
    getLocale(),
    getDict(),
    getSessionUser(),
    getCartItemCount(),
  ]);

  return (
    <>
      <Navbar dict={dict} locale={locale} user={user} cartCount={cartCount} />
      <main>{children}</main>
      <Footer dict={dict} />
    </>
  );
}
