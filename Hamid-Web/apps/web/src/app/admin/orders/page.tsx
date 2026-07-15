import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { db, orders, type OrderStatus } from "@hamid/db";
import { formatMoney, toCents } from "@hamid/core";
import { Table, Thead, Th, Tr, Td, EmptyRow } from "@/components/admin/table";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  out_for_delivery: "Out for delivery",
  ready_for_pickup: "Ready for pickup",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const rows = status
    ? await db.select().from(orders).where(eq(orders.status, status as OrderStatus)).orderBy(desc(orders.createdAt)).limit(100)
    : await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(100);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-on-surface">Orders</h1>

      <div className="my-4 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`rounded-full px-3 py-1 text-xs font-semibold ${!status ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant"}`}
        >
          All
        </Link>
        {Object.entries(STATUS_LABEL).map(([key, label]) => (
          <Link
            key={key}
            href={`/admin/orders?status=${key}`}
            className={`rounded-full px-3 py-1 text-xs font-semibold ${status === key ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant"}`}
          >
            {label}
          </Link>
        ))}
      </div>

      <Table>
        <Thead>
          <tr>
            <Th>Order #</Th>
            <Th>Placed</Th>
            <Th>Fulfillment</Th>
            <Th>Total</Th>
            <Th>Status</Th>
            <Th className="text-end">Actions</Th>
          </tr>
        </Thead>
        <tbody>
          {rows.map((o) => (
            <Tr key={o.id}>
              <Td className="font-mono font-medium">{o.orderNumber}</Td>
              <Td className="text-on-surface-variant">{new Date(o.placedAt).toLocaleString()}</Td>
              <Td className="text-on-surface-variant capitalize">{o.fulfillmentType}</Td>
              <Td>{formatMoney(toCents(o.grandTotal))}</Td>
              <Td>
                <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-xs text-on-surface-variant">
                  {STATUS_LABEL[o.status]}
                </span>
              </Td>
              <Td className="text-end">
                <Link href={`/admin/orders/${o.id}`} className="text-sm font-semibold text-primary hover:underline">
                  View
                </Link>
              </Td>
            </Tr>
          ))}
          {rows.length === 0 && <EmptyRow colSpan={6}>No orders yet.</EmptyRow>}
        </tbody>
      </Table>
    </div>
  );
}
