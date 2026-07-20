import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db, paymentMethods } from "@hamid/db";
import { getCart } from "@/lib/cart/queries";
import { getSessionUser } from "@/lib/auth/rbac";
import { getDict, getLocale } from "@/lib/i18n";
import { getGovernorateFees } from "@/lib/settings/queries";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export default async function CheckoutPage() {
  const locale = await getLocale();
  const [cart, user, methods, dict, governorateFees] = await Promise.all([
    getCart(locale),
    getSessionUser(),
    db.select().from(paymentMethods).where(eq(paymentMethods.isActive, true)),
    getDict(),
    getGovernorateFees(),
  ]);

  if (cart.lines.length === 0) redirect("/cart");

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-16 md:py-16">
      <h1 className="mb-8 font-display text-3xl font-bold text-on-surface">{dict.checkout.title}</h1>
      <CheckoutForm
        isLoggedIn={!!user}
        paymentMethods={methods.map((m) => ({ code: m.code, name: m.name }))}
        dict={dict}
        locale={locale}
        cartLines={cart.lines}
        initialSubtotalCents={cart.subtotalCents}
        governorates={governorateFees.map((g) => g.name)}
      />
    </div>
  );
}
