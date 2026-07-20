import Link from "next/link";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { PackageSearch, MapPin } from "lucide-react";
import { db, users } from "@hamid/db";
import { getSessionUser } from "@/lib/auth/rbac";
import { getOrCreateCustomer, getCustomerOrders } from "@/lib/account/queries";
import { Card, CardContent } from "@/components/ui/card";
import { VerifyEmailBanner } from "@/components/auth/verify-email-banner";

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?callbackUrl=/account");

  const customer = await getOrCreateCustomer(Number(user.id));
  const [orders, [dbUser]] = await Promise.all([
    getCustomerOrders(customer.id),
    db.select({ emailVerifiedAt: users.emailVerifiedAt }).from(users).where(eq(users.id, Number(user.id))).limit(1),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:px-16 md:py-16">
      <h1 className="mb-1 font-display text-3xl font-bold text-on-surface">My Account</h1>
      <p className="mb-8 text-sm text-on-surface-variant">
        {user.name ?? user.email} {user.email && user.name ? `· ${user.email}` : ""}
      </p>

      {!dbUser?.emailVerifiedAt && <VerifyEmailBanner />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/account/orders">
          <Card className="transition-colors hover:bg-surface-container">
            <CardContent className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-secondary">
                <PackageSearch size={20} />
              </div>
              <div>
                <p className="font-semibold text-on-surface">My Orders</p>
                <p className="text-sm text-on-surface-variant">{orders.length} order{orders.length === 1 ? "" : "s"}</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/account/addresses">
          <Card className="transition-colors hover:bg-surface-container">
            <CardContent className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-secondary">
                <MapPin size={20} />
              </div>
              <div>
                <p className="font-semibold text-on-surface">Saved Addresses</p>
                <p className="text-sm text-on-surface-variant">Manage delivery addresses</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
