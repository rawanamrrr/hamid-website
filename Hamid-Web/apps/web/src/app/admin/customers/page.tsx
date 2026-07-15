import Link from "next/link";
import { desc, eq, count, sum } from "drizzle-orm";
import { db, customers, users, orders } from "@hamid/db";
import { formatMoney, toCents } from "@hamid/core";
import { Table, Thead, Th, Tr, Td, EmptyRow } from "@/components/admin/table";

export default async function AdminCustomersPage() {
  const rows = await db
    .select({
      id: customers.id,
      fullName: users.fullName,
      email: users.email,
      phone: users.phone,
      loyaltyPoints: customers.loyaltyPoints,
      createdAt: customers.createdAt,
      orderCount: count(orders.id),
      totalSpent: sum(orders.grandTotal),
    })
    .from(customers)
    .innerJoin(users, eq(users.id, customers.userId))
    .leftJoin(orders, eq(orders.customerId, customers.id))
    .groupBy(customers.id, users.fullName, users.email, users.phone, customers.loyaltyPoints, customers.createdAt)
    .orderBy(desc(customers.createdAt));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-on-surface">Customers</h1>

      <div className="mt-6">
        <Table>
          <Thead>
            <tr>
              <Th>Name</Th>
              <Th>Email</Th>
              <Th>Phone</Th>
              <Th>Orders</Th>
              <Th>Total spent</Th>
              <Th>Joined</Th>
              <Th className="text-end">Actions</Th>
            </tr>
          </Thead>
          <tbody>
            {rows.map((c) => (
              <Tr key={c.id}>
                <Td className="font-medium">{c.fullName}</Td>
                <Td className="text-on-surface-variant">{c.email}</Td>
                <Td className="text-on-surface-variant">{c.phone ?? "—"}</Td>
                <Td>{c.orderCount}</Td>
                <Td>{formatMoney(toCents(c.totalSpent ?? "0"))}</Td>
                <Td className="text-on-surface-variant">{new Date(c.createdAt).toLocaleDateString()}</Td>
                <Td className="text-end">
                  <Link href={`/admin/customers/${c.id}`} className="text-sm font-semibold text-primary hover:underline">
                    View
                  </Link>
                </Td>
              </Tr>
            ))}
            {rows.length === 0 && <EmptyRow colSpan={7}>No customers yet.</EmptyRow>}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
