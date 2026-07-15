import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { formatMoney, toCents } from "@hamid/core";
import { getOrderDetail } from "@/lib/orders/queries";
import { getDict } from "@/lib/i18n";
import { InstapayUpload } from "@/components/checkout/instapay-upload";

export default async function OrderConfirmationPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const { orderNumber } = await params;
  const [detail, dict] = await Promise.all([getOrderDetail(orderNumber), getDict()]);
  if (!detail) notFound();

  const { order, items, payment } = detail;

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 text-center md:px-0">
      <CheckCircle2 size={48} className="mx-auto mb-4 text-secondary" />
      <h1 className="font-display text-2xl font-bold text-on-surface">Thank you for your order!</h1>
      <p className="mt-2 text-on-surface-variant">
        Order <span className="font-mono font-semibold">{order.orderNumber}</span> has been placed.
      </p>

      <div className="mt-8 rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6 text-start">
        <div className="space-y-2 text-sm">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-on-surface-variant">
              <span>
                {item.nameSnapshot} × {item.quantity}
              </span>
              <span>{formatMoney(toCents(item.lineTotal))}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 border-t border-outline-variant/60 pt-4 text-sm">
          <div className="flex justify-between text-on-surface-variant">
            <span>{dict.checkout.deliveryFee}</span>
            <span>{formatMoney(toCents(order.deliveryFee))}</span>
          </div>
          {Number(order.discountTotal) > 0 && (
            <div className="flex justify-between text-on-surface-variant">
              <span>{dict.checkout.discount}</span>
              <span>-{formatMoney(toCents(order.discountTotal))}</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-on-surface">
            <span>{dict.checkout.total}</span>
            <span>{formatMoney(toCents(order.grandTotal))}</span>
          </div>
        </div>
      </div>

      {payment?.methodCode === "instapay" && payment.status === "pending" && (
        <div className="mt-6">
          <InstapayUpload orderNumber={order.orderNumber} hint={dict.checkout.instapayUploadHint} />
        </div>
      )}
      {payment?.methodCode === "instapay" && payment.status === "submitted" && (
        <p className="mt-6 text-sm text-on-surface-variant">
          Your payment proof was submitted and is awaiting review. We&apos;ll confirm your order shortly.
        </p>
      )}
    </div>
  );
}
