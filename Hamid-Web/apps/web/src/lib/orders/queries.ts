import "server-only";
import { eq } from "drizzle-orm";
import { db, orders, orderItems, payments, paymentMethods, customers } from "@hamid/db";
import { auth } from "@/auth";

/**
 * Guest orders are looked up by order number alone (the standard "guest order
 * tracking" pattern — no account exists to check ownership against). Logged-in
 * users are additionally verified against the order's customerId so one
 * customer can't browse another's order by guessing numbers.
 */
export async function getOwnedOrder(orderNumber: string) {
  const session = await auth();
  const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  if (!order) return null;

  if (order.customerId) {
    if (!session?.user) return null;
    const [customer] = await db.select().from(customers).where(eq(customers.userId, Number(session.user.id))).limit(1);
    if (!customer || customer.id !== order.customerId) return null;
  }
  return order;
}

export async function getOrderDetail(orderNumber: string) {
  const order = await getOwnedOrder(orderNumber);
  if (!order) return null;

  const [items, [payment]] = await Promise.all([
    db.select().from(orderItems).where(eq(orderItems.orderId, order.id)),
    db
      .select({ status: payments.status, methodCode: paymentMethods.code, methodName: paymentMethods.name })
      .from(payments)
      .innerJoin(paymentMethods, eq(paymentMethods.id, payments.methodId))
      .where(eq(payments.orderId, order.id))
      .limit(1),
  ]);

  return { order, items, payment };
}
