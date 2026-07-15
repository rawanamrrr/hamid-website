import { notFound } from "next/navigation";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db, customers, users, addresses, orders } from "@hamid/db";
import { formatMoney, toCents } from "@hamid/core";
import { Card, CardContent } from "@/components/ui/card";
import { Table, Thead, Th, Tr, Td, EmptyRow } from "@/components/admin/table";

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customerId = Number(id);

  const [row] = await db
    .select({ id: customers.id, fullName: users.fullName, email: users.email, phone: users.phone, loyaltyPoints: customers.loyaltyPoints })
    .from(customers)
    .innerJoin(users, eq(users.id, customers.userId))
    .where(eq(customers.id, customerId))
    .limit(1);
  if (!row) notFound();

  const [customerAddresses, customerOrders] = await Promise.all([
    db.select().from(addresses).where(eq(addresses.customerId, customerId)),
    db.select().from(orders).where(eq(orders.customerId, customerId)).orderBy(desc(orders.createdAt)),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-on-surface">{row.fullName}</h1>
      <p className="text-sm text-on-surface-variant">
        {row.email} {row.phone && `· ${row.phone}`} · {row.loyaltyPoints} loyalty points
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent>
            <h2 className="mb-3 font-display text-base font-bold text-on-surface">Addresses</h2>
            <div className="space-y-3">
              {customerAddresses.map((a) => (
                <p key={a.id} className="text-sm text-on-surface-variant">
                  {a.recipientName} — {a.street}, {a.area}, {a.city}, {a.governorate}
                </p>
              ))}
              {customerAddresses.length === 0 && <p className="text-sm text-on-surface-variant">No saved addresses.</p>}
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Table>
            <Thead>
              <tr>
                <Th>Order #</Th>
                <Th>Date</Th>
                <Th>Total</Th>
                <Th>Status</Th>
              </tr>
            </Thead>
            <tbody>
              {customerOrders.map((o) => (
                <Tr key={o.id}>
                  <Td>
                    <Link href={`/admin/orders/${o.id}`} className="font-mono font-medium text-primary hover:underline">
                      {o.orderNumber}
                    </Link>
                  </Td>
                  <Td className="text-on-surface-variant">{new Date(o.createdAt).toLocaleDateString()}</Td>
                  <Td>{formatMoney(toCents(o.grandTotal))}</Td>
                  <Td className="capitalize text-on-surface-variant">{o.status.replace(/_/g, " ")}</Td>
                </Tr>
              ))}
              {customerOrders.length === 0 && <EmptyRow colSpan={4}>No orders yet.</EmptyRow>}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
