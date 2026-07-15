"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, payments, orders, orderStatusHistory } from "@hamid/db";
import { guardPermission, type ActionResult } from "@/lib/auth/rbac";
import { logActivity } from "@/lib/activity/log";

export async function reviewPaymentAction(
  paymentId: number,
  decision: "approved" | "rejected",
  notes?: string,
): Promise<ActionResult> {
  const guard = await guardPermission("payments.review");
  if ("error" in guard) return guard;

  const [payment] = await db.select().from(payments).where(eq(payments.id, paymentId)).limit(1);
  if (!payment) return { error: "Payment not found." };

  await db.transaction(async (tx) => {
    await tx
      .update(payments)
      .set({ status: decision, reviewedBy: Number(guard.id), reviewedAt: new Date(), notes: notes || null })
      .where(eq(payments.id, paymentId));

    if (decision === "approved") {
      const [order] = await tx.select().from(orders).where(eq(orders.id, payment.orderId)).limit(1);
      if (order && order.status === "pending") {
        await tx.update(orders).set({ status: "confirmed" }).where(eq(orders.id, order.id));
        await tx.insert(orderStatusHistory).values({
          orderId: order.id,
          status: "confirmed",
          note: "Payment approved.",
          changedBy: Number(guard.id),
        });
      }
    }
  });

  await logActivity({ actorUserId: Number(guard.id), action: `payment.${decision}`, entityType: "payment", entityId: paymentId });

  revalidatePath("/admin/payments");
  revalidatePath(`/admin/orders/${payment.orderId}`);
  return { success: true };
}
