"use server";

import { eq, and, gte, count, sql } from "drizzle-orm";
import {
  db,
  customers,
  addresses,
  orders,
  orderItems,
  orderStatusHistory,
  orderDiscounts,
  discountRedemptions,
  discounts,
  payments,
  paymentMethods,
  storeProducts,
  carts,
  cartItems,
  settings,
} from "@hamid/db";
import {
  checkoutSchema,
  type CheckoutInput,
  applyDiscountsToCart,
  computeOrderTotals,
  generateOrderNumber,
  toCents,
  fromCents,
  type CartLineLike,
} from "@hamid/core";
import { auth } from "@/auth";
import { getCart } from "@/lib/cart/queries";
import { getAutoDiscounts, getDiscountByCode } from "@/lib/discounts/resolve";
import { getGuestCartToken, clearGuestCartCookie } from "@/lib/cart/guest-token";
import type { ActionResult } from "@/lib/auth/rbac";
import { sendEmail } from "@/lib/email/mailer";
import { getGovernorateFees, getNotificationEmail } from "@/lib/settings/queries";
import { formatMoney } from "@hamid/core";

/**
 * Delivery fee for a governorate: the per-governorate table from Admin →
 * Settings wins; the flat delivery_fee setting is the fallback for
 * unconfigured governorates (and when no table exists at all).
 */
async function getDeliveryFeeCents(governorate?: string | null): Promise<number> {
  if (governorate?.trim()) {
    const fees = await getGovernorateFees();
    const match = fees.find((g) => g.name.trim().toLowerCase() === governorate.trim().toLowerCase());
    if (match) return toCents(match.fee);
  }
  const [row] = await db.select().from(settings).where(and(eq(settings.group, "checkout"), eq(settings.key, "delivery_fee"))).limit(1);
  return toCents((row?.value as string) ?? "30.00");
}

/**
 * Shared by placeOrderAction (commits) and previewOrderTotalsAction (read-only,
 * powers the checkout page's live totals) so pricing logic can't drift between
 * what the customer sees and what they're actually charged.
 */
async function computeCheckoutPricing(
  fulfillmentType: "delivery" | "pickup",
  discountCode: string | undefined,
  governorate?: string | null,
) {
  const session = await auth();
  const userId = session?.user ? Number(session.user.id) : null;

  const cart = await getCart();

  const lines: CartLineLike[] = cart.lines.map((l) => ({
    productId: l.productId,
    categoryId: l.categoryId,
    unitPriceCents: l.unitPriceCents,
    quantity: l.quantity,
  }));

  const autoDiscounts = await getAutoDiscounts();
  let codeDiscount: Awaited<ReturnType<typeof getDiscountByCode>> = null;
  if (discountCode) {
    codeDiscount = await getDiscountByCode(discountCode);
  }

  let userRedemptionCount = 0;
  if (codeDiscount && userId) {
    const [row] = await db
      .select({ value: count() })
      .from(discountRedemptions)
      .where(and(eq(discountRedemptions.discountId, codeDiscount.id), eq(discountRedemptions.userId, userId)));
    userRedemptionCount = row?.value ?? 0;
  }

  const discountResult = applyDiscountsToCart(
    lines,
    autoDiscounts,
    codeDiscount ? { discount: codeDiscount, userRedemptionCount } : null,
  );

  const deliveryFeeCents = fulfillmentType === "delivery" ? await getDeliveryFeeCents(governorate) : 0;
  const totals = computeOrderTotals({
    subtotalCents: discountResult.subtotalCents,
    discountTotalCents: discountResult.discountTotalCents,
    deliveryFeeCents,
  });

  return { cart, userId, codeDiscount, discountResult, totals };
}

export interface CheckoutTotalsPreview {
  subtotalCents: number;
  discountTotalCents: number;
  deliveryFeeCents: number;
  taxTotalCents: number;
  grandTotalCents: number;
  discountError?: string;
}

/** Read-only — recomputes totals as fulfillment type / discount code change, before the order is placed. */
export async function previewOrderTotalsAction(
  fulfillmentType: "delivery" | "pickup",
  discountCode: string | undefined,
  governorate?: string | null,
): Promise<ActionResult<CheckoutTotalsPreview>> {
  const cart = await getCart();
  if (cart.lines.length === 0) {
    return { success: true, data: { subtotalCents: 0, discountTotalCents: 0, deliveryFeeCents: 0, taxTotalCents: 0, grandTotalCents: 0 } };
  }

  const code = discountCode?.trim() || undefined;
  const { discountResult, totals } = await computeCheckoutPricing(fulfillmentType, code, governorate);
  const discountError = code && discountResult.codeError ? discountResult.codeError : undefined;

  return {
    success: true,
    data: {
      subtotalCents: toCents(totals.subtotal),
      discountTotalCents: toCents(totals.discountTotal),
      deliveryFeeCents: toCents(totals.deliveryFee),
      taxTotalCents: toCents(totals.taxTotal),
      grandTotalCents: toCents(totals.grandTotal),
      discountError,
    },
  };
}

export async function placeOrderAction(input: CheckoutInput): Promise<ActionResult<{ orderNumber: string }>> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid checkout details." };
  const data = parsed.data;

  // Resolve the delivery governorate first — it determines the delivery fee.
  let governorate: string | null = data.newAddress?.governorate ?? null;
  if (data.fulfillmentType === "delivery" && !governorate && data.addressId) {
    const [saved] = await db.select({ governorate: addresses.governorate }).from(addresses).where(eq(addresses.id, data.addressId)).limit(1);
    governorate = saved?.governorate ?? null;
  }

  const { cart, userId, codeDiscount, discountResult, totals } = await computeCheckoutPricing(
    data.fulfillmentType,
    data.discountCode,
    governorate,
  );
  if (cart.lines.length === 0) return { error: "Your cart is empty." };

  for (const line of cart.lines) {
    if (line.quantity > line.stockQty) return { error: `${line.name} no longer has enough stock.` };
  }

  if (data.discountCode && !codeDiscount) return { error: "Invalid discount code." };
  if (data.discountCode && discountResult.codeError) return { error: discountResult.codeError };

  const [method] = await db.select().from(paymentMethods).where(and(eq(paymentMethods.code, data.paymentMethodCode), eq(paymentMethods.isActive, true))).limit(1);
  if (!method) return { error: "Selected payment method is not available." };

  let customerId: number | null = null;
  if (userId) {
    const [customer] = await db.select().from(customers).where(eq(customers.userId, userId)).limit(1);
    customerId = customer?.id ?? null;
  }

  // ── Address resolution (delivery only) ────────────────────────────────
  let addressId: number | null = null;
  if (data.fulfillmentType === "delivery") {
    if (data.addressId) {
      addressId = data.addressId;
    } else if (data.newAddress) {
      const guestToken = customerId ? null : await getGuestCartToken();
      const [row] = await db
        .insert(addresses)
        .values({ ...data.newAddress, customerId, guestToken })
        .$returningId();
      addressId = row.id;
    } else {
      return { error: "A delivery address is required." };
    }
  }

  // ── Create order ──────────────────────────────────────────────────────
  const orderNumber = generateOrderNumber();

  try {
  await db.transaction(async (tx) => {
    const [orderRow] = await tx
      .insert(orders)
      .values({
        orderNumber,
        customerId,
        guestContact: customerId ? null : data.guestContact,
        channel: "web",
        status: "pending",
        fulfillmentType: data.fulfillmentType,
        addressId,
        subtotal: totals.subtotal,
        discountTotal: totals.discountTotal,
        taxTotal: totals.taxTotal,
        deliveryFee: totals.deliveryFee,
        grandTotal: totals.grandTotal,
      })
      .$returningId();

    await tx.insert(orderItems).values(
      cart.lines.map((l) => ({
        orderId: orderRow.id,
        storeProductId: l.productId,
        nameSnapshot: l.name,
        unitPrice: (l.unitPriceCents / 100).toFixed(2),
        quantity: l.quantity,
        lineTotal: (l.lineTotalCents / 100).toFixed(2),
      })),
    );

    await tx.insert(orderStatusHistory).values({ orderId: orderRow.id, status: "pending", note: "Order placed." });

    if (discountResult.appliedDiscounts.length > 0) {
      // Each row gets that discount's own share (already split proportionally
      // by applyDiscountsToCart when multiple discounts stack) — not the
      // combined order total, which would over-report every discount's impact.
      await tx.insert(orderDiscounts).values(
        discountResult.appliedDiscounts.map((a) => ({
          orderId: orderRow.id,
          discountId: a.discountId,
          code: a.isCode ? codeDiscount?.code ?? null : null,
          amount: fromCents(a.amountCents),
        })),
      );
      for (const a of discountResult.appliedDiscounts) {
        await tx
          .update(discounts)
          .set({ usedCount: sql`${discounts.usedCount} + 1` })
          .where(eq(discounts.id, a.discountId));
        if (a.isCode) {
          await tx.insert(discountRedemptions).values({
            discountId: a.discountId,
            orderId: orderRow.id,
            userId,
            amount: fromCents(a.amountCents),
          });
        }
      }
    }

    await tx.insert(payments).values({
      orderId: orderRow.id,
      methodId: method.id,
      amount: totals.grandTotal,
      status: "pending",
    });

    for (const line of cart.lines) {
      // Guard the decrement with stockQty >= quantity so two concurrent
      // checkouts can't both pass the earlier read-only check and both
      // decrement past zero (TOCTOU race). If this doesn't match any row,
      // someone else's order already used up the remaining stock — abort
      // the whole transaction rather than sell something we don't have.
      const [result] = await tx
        .update(storeProducts)
        .set({ stockQty: sql`${storeProducts.stockQty} - ${line.quantity}` })
        .where(and(eq(storeProducts.id, line.productId), gte(storeProducts.stockQty, line.quantity)));
      if (result.affectedRows === 0) {
        throw new Error(`${line.name} no longer has enough stock.`);
      }
    }

    if (cart.cartId) {
      await tx.delete(cartItems).where(eq(cartItems.cartId, cart.cartId));
      await tx.update(carts).set({ status: "converted" }).where(eq(carts.id, cart.cartId));
    }

    return orderRow.id;
  });
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Could not place your order. Please try again." };
  }

  if (!customerId) await clearGuestCartCookie();

  const session = await auth();
  const recipientEmail = session?.user?.email ?? data.guestContact?.email;
  const recipientName = session?.user?.name ?? data.guestContact?.name ?? "there";
  if (recipientEmail) {
    const itemsHtml = cart.lines
      .map((l) => `<li>${l.name} × ${l.quantity} — ${formatMoney(l.lineTotalCents)}</li>`)
      .join("");
    const itemsText = cart.lines.map((l) => `- ${l.name} x${l.quantity} — ${formatMoney(l.lineTotalCents)}`).join("\n");
    await sendEmail({
      to: recipientEmail,
      subject: `Order confirmed — ${orderNumber}`,
      text: `Hello ${recipientName},\n\nThanks for your order! Your order ${orderNumber} has been received.\n\n${itemsText}\n\nTotal: ${formatMoney(toCents(totals.grandTotal))}\n\nTrack it at: ${(process.env.AUTH_URL ?? "http://localhost:3000").replace(/\/$/, "")}/order/${orderNumber}`,
      html: `<p>Hello ${recipientName},</p><p>Thanks for your order! Your order <strong>${orderNumber}</strong> has been received.</p><ul>${itemsHtml}</ul><p>Total: <strong>${formatMoney(toCents(totals.grandTotal))}</strong></p><p><a href="${(process.env.AUTH_URL ?? "http://localhost:3000").replace(/\/$/, "")}/order/${orderNumber}">Track your order</a></p>`,
    });
  }

  // Admin alert — configurable address in Admin → Settings. Never let a mail
  // failure affect the customer's already-committed order.
  try {
    const adminEmail = await getNotificationEmail();
    if (adminEmail) {
      const summaryText = cart.lines.map((l) => `- ${l.name} x${l.quantity} — ${formatMoney(l.lineTotalCents)}`).join("\n");
      const summaryHtml = cart.lines.map((l) => `<li>${l.name} × ${l.quantity} — ${formatMoney(l.lineTotalCents)}</li>`).join("");
      const adminUrl = `${(process.env.AUTH_URL ?? "http://localhost:3000").replace(/\/$/, "")}/admin/orders`;
      const who = recipientName !== "there" ? recipientName : recipientEmail ?? "Guest";
      await sendEmail({
        to: adminEmail,
        subject: `New order ${orderNumber} — ${formatMoney(toCents(totals.grandTotal))}`,
        text: `New ${data.fulfillmentType} order ${orderNumber} from ${who}.\n\n${summaryText}\n\nTotal: ${formatMoney(toCents(totals.grandTotal))}\n\nManage: ${adminUrl}`,
        html: `<p>New <strong>${data.fulfillmentType}</strong> order <strong>${orderNumber}</strong> from ${who}.</p><ul>${summaryHtml}</ul><p>Total: <strong>${formatMoney(toCents(totals.grandTotal))}</strong></p><p><a href="${adminUrl}">Open the orders dashboard</a></p>`,
      });
    }
  } catch (err) {
    console.error("Admin order notification failed:", err);
  }

  return { success: true, data: { orderNumber } };
}
