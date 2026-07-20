import { count, sum, eq, inArray, lt, and, isNull } from "drizzle-orm";
import { db, orders, payments, storeProducts } from "@hamid/db";
import { formatMoney, toCents } from "@hamid/core";
import { Card, CardContent } from "@/components/ui/card";

async function getKpis() {
  const [[orderCount], [revenue], [pendingPayments], [lowStock]] = await Promise.all([
    db.select({ value: count() }).from(orders),
    db
      .select({ value: sum(orders.grandTotal) })
      .from(orders)
      .where(eq(orders.status, "completed")),
    db
      .select({ value: count() })
      .from(payments)
      .where(inArray(payments.status, ["pending", "submitted"])),
    db
      .select({ value: count() })
      .from(storeProducts)
      .where(and(eq(storeProducts.isActive, true), lt(storeProducts.stockQty, 10), isNull(storeProducts.deletedAt))),
  ]);

  return {
    orderCount: orderCount?.value ?? 0,
    revenueCents: toCents(revenue?.value ?? "0"),
    pendingPayments: pendingPayments?.value ?? 0,
    lowStock: lowStock?.value ?? 0,
  };
}

export default async function AdminOverviewPage() {
  const kpis = await getKpis();

  const cards = [
    { label: "Total Orders", value: kpis.orderCount.toLocaleString() },
    { label: "Completed Revenue", value: formatMoney(kpis.revenueCents) },
    { label: "Payments Awaiting Review", value: kpis.pendingPayments.toLocaleString() },
    { label: "Low Stock Products", value: kpis.lowStock.toLocaleString() },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-on-surface">Dashboard</h1>
      <p className="mt-1 text-sm text-on-surface-variant">A quick look at how the café is doing.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent>
              <p className="text-sm text-on-surface-variant">{c.label}</p>
              <p className="mt-2 font-display text-3xl font-bold text-on-surface">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
