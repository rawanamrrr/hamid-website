import Link from "next/link";
import NextImage from "next/image";
import { desc, eq } from "drizzle-orm";
import { db, payments, orders, paymentMethods, media } from "@hamid/db";
import { formatMoney, toCents } from "@hamid/core";
import { createPresignedGetUrl } from "@/lib/media/s3";
import { Table, Thead, Th, Tr, Td, EmptyRow } from "@/components/admin/table";
import { PaymentReviewActions } from "@/components/admin/payments/review-actions";

export default async function AdminPaymentsPage() {
  const rows = await db
    .select({
      id: payments.id,
      status: payments.status,
      amount: payments.amount,
      orderId: payments.orderId,
      orderNumber: orders.orderNumber,
      methodCode: paymentMethods.code,
      methodName: paymentMethods.name,
      proofBucket: media.bucket,
      proofObjectKey: media.objectKey,
    })
    .from(payments)
    .innerJoin(orders, eq(orders.id, payments.orderId))
    .innerJoin(paymentMethods, eq(paymentMethods.id, payments.methodId))
    .leftJoin(media, eq(media.id, payments.proofMediaId))
    .orderBy(desc(payments.createdAt))
    .limit(100);

  const rowsWithProof = await Promise.all(
    rows.map(async (r) => ({
      ...r,
      proofUrl: r.proofBucket && r.proofObjectKey ? await createPresignedGetUrl(r.proofBucket, r.proofObjectKey) : null,
    })),
  );

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-on-surface">Payments</h1>
      <p className="mt-1 text-sm text-on-surface-variant">Review InstaPay screenshots and confirm Cash on Delivery orders.</p>

      <div className="mt-6">
        <Table>
          <Thead>
            <tr>
              <Th>Order</Th>
              <Th>Method</Th>
              <Th>Amount</Th>
              <Th>Proof</Th>
              <Th>Status</Th>
              <Th className="text-end">Actions</Th>
            </tr>
          </Thead>
          <tbody>
            {rowsWithProof.map((p) => (
              <Tr key={p.id}>
                <Td>
                  <Link href={`/admin/orders/${p.orderId}`} className="font-mono font-medium text-primary hover:underline">
                    {p.orderNumber}
                  </Link>
                </Td>
                <Td className="text-on-surface-variant">{p.methodName}</Td>
                <Td>{formatMoney(toCents(p.amount))}</Td>
                <Td>
                  {p.proofUrl ? (
                    <a href={p.proofUrl} target="_blank" rel="noreferrer" className="relative block h-12 w-12 overflow-hidden rounded-lg">
                      <NextImage src={p.proofUrl} alt="Payment proof" fill unoptimized className="object-cover" />
                    </a>
                  ) : (
                    <span className="text-xs text-on-surface-variant">—</span>
                  )}
                </Td>
                <Td>
                  <span className="rounded-full bg-surface-container-high px-2 py-0.5 text-xs capitalize text-on-surface-variant">
                    {p.status}
                  </span>
                </Td>
                <Td className="text-end">
                  {(p.status === "pending" || p.status === "submitted") && <PaymentReviewActions paymentId={p.id} />}
                </Td>
              </Tr>
            ))}
            {rowsWithProof.length === 0 && <EmptyRow colSpan={6}>No payments yet.</EmptyRow>}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
