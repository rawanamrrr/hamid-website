"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, formatMoney, type CheckoutInput } from "@hamid/core";
import { placeOrderAction, previewOrderTotalsAction, type CheckoutTotalsPreview } from "@/lib/checkout/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, FormError } from "@/components/ui/card";
import type { CartLineView } from "@/lib/cart/queries";
import type { Dictionary, Locale } from "@/lib/i18n";

export function CheckoutForm({
  isLoggedIn,
  paymentMethods,
  dict,
  locale,
  cartLines,
  initialSubtotalCents,
}: {
  isLoggedIn: boolean;
  paymentMethods: { code: string; name: string }[];
  dict: Dictionary;
  locale: Locale;
  cartLines: CartLineView[];
  initialSubtotalCents: number;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [preview, setPreview] = useState<CheckoutTotalsPreview>({
    subtotalCents: initialSubtotalCents,
    discountTotalCents: 0,
    deliveryFeeCents: 0,
    taxTotalCents: 0,
    grandTotalCents: initialSubtotalCents,
  });
  const [previewPending, setPreviewPending] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema) as unknown as Resolver<CheckoutInput>,
    defaultValues: {
      fulfillmentType: "delivery",
      paymentMethodCode: (paymentMethods[0]?.code as CheckoutInput["paymentMethodCode"]) ?? "cash_on_delivery",
    },
  });

  const fulfillmentType = watch("fulfillmentType");
  const discountCode = watch("discountCode");

  // Debounced live recompute — reuses the exact same pricing logic placeOrderAction
  // commits with, so what's shown here can never drift from what's actually charged.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPreviewPending(true);
      previewOrderTotalsAction(fulfillmentType, discountCode)
        .then((result) => {
          if ("error" in result) return;
          setPreview(result.data);
        })
        .finally(() => setPreviewPending(false));
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fulfillmentType, discountCode]);

  async function onSubmit(values: CheckoutInput) {
    setServerError(null);
    const result = await placeOrderAction(values);
    if ("error" in result) {
      setServerError(result.error);
      return;
    }
    router.push(`/order/${result.data.orderNumber}`);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 lg:col-span-2">
        <FormError>{serverError}</FormError>

        <Card>
          <CardContent className="space-y-4">
            <h2 className="font-display text-lg font-bold text-on-surface">{dict.checkout.fulfillment}</h2>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" value="delivery" {...register("fulfillmentType")} /> {dict.checkout.delivery}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="radio" value="pickup" {...register("fulfillmentType")} /> {dict.checkout.pickup}
              </label>
            </div>
          </CardContent>
        </Card>

        {!isLoggedIn && (
          <Card>
            <CardContent className="space-y-4">
              <h2 className="font-display text-lg font-bold text-on-surface">{dict.checkout.contactInfo}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="guestContact.name">Full name</Label>
                  <Input id="guestContact.name" {...register("guestContact.name")} />
                  {errors.guestContact?.name && <p className="mt-1 text-xs text-error">{errors.guestContact.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="guestContact.phone">Phone</Label>
                  <Input id="guestContact.phone" {...register("guestContact.phone")} />
                  {errors.guestContact?.phone && <p className="mt-1 text-xs text-error">{errors.guestContact.phone.message}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="guestContact.email">Email (optional)</Label>
                <Input id="guestContact.email" type="email" {...register("guestContact.email")} />
              </div>
            </CardContent>
          </Card>
        )}

        {fulfillmentType === "delivery" && (
          <Card>
            <CardContent className="space-y-4">
              <h2 className="font-display text-lg font-bold text-on-surface">{dict.checkout.deliveryAddress}</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="newAddress.recipientName">Recipient name</Label>
                  <Input id="newAddress.recipientName" {...register("newAddress.recipientName")} />
                </div>
                <div>
                  <Label htmlFor="newAddress.phone">Phone</Label>
                  <Input id="newAddress.phone" {...register("newAddress.phone")} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="newAddress.governorate">Governorate</Label>
                  <Input id="newAddress.governorate" {...register("newAddress.governorate")} />
                </div>
                <div>
                  <Label htmlFor="newAddress.city">City</Label>
                  <Input id="newAddress.city" {...register("newAddress.city")} />
                </div>
                <div>
                  <Label htmlFor="newAddress.area">Area</Label>
                  <Input id="newAddress.area" {...register("newAddress.area")} />
                </div>
              </div>
              <div>
                <Label htmlFor="newAddress.street">Street</Label>
                <Input id="newAddress.street" {...register("newAddress.street")} />
                {errors.addressId && <p className="mt-1 text-xs text-error">{errors.addressId.message}</p>}
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor="newAddress.building">Building</Label>
                  <Input id="newAddress.building" {...register("newAddress.building")} />
                </div>
                <div>
                  <Label htmlFor="newAddress.floor">Floor</Label>
                  <Input id="newAddress.floor" {...register("newAddress.floor")} />
                </div>
                <div>
                  <Label htmlFor="newAddress.apartment">Apartment</Label>
                  <Input id="newAddress.apartment" {...register("newAddress.apartment")} />
                </div>
              </div>
              <div>
                <Label htmlFor="newAddress.landmark">Landmark (optional)</Label>
                <Input id="newAddress.landmark" {...register("newAddress.landmark")} />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="space-y-4">
            <h2 className="font-display text-lg font-bold text-on-surface">{dict.checkout.discountCode}</h2>
            <Input placeholder="e.g. RAMADAN25" {...register("discountCode")} />
            {preview.discountError && <p className="text-xs text-error">{preview.discountError}</p>}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3">
            <h2 className="font-display text-lg font-bold text-on-surface">{dict.checkout.paymentMethod}</h2>
            {paymentMethods.map((m) => (
              <label key={m.code} className="flex items-center gap-2 text-sm">
                <input type="radio" value={m.code} {...register("paymentMethodCode")} /> {m.name}
              </label>
            ))}
          </CardContent>
        </Card>

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "…" : dict.checkout.placeOrder}
        </Button>
      </form>

      <div className="h-fit rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-6">
        <h2 className="mb-4 font-display text-lg font-bold text-on-surface">{dict.checkout.orderSummary}</h2>
        <div className="space-y-2 text-sm">
          {cartLines.map((l) => (
            <div key={l.id} className="flex justify-between text-on-surface-variant">
              <span>
                {l.name} × {l.quantity}
              </span>
              <span>{formatMoney(l.lineTotalCents, "EGP", locale)}</span>
            </div>
          ))}
        </div>
        <div className={`mt-4 space-y-1.5 border-t border-outline-variant/60 pt-4 text-sm transition-opacity ${previewPending ? "opacity-60" : ""}`}>
          <div className="flex justify-between text-on-surface-variant">
            <span>{dict.cart.subtotal}</span>
            <span>{formatMoney(preview.subtotalCents, "EGP", locale)}</span>
          </div>
          {fulfillmentType === "delivery" && (
            <div className="flex justify-between text-on-surface-variant">
              <span>{dict.checkout.deliveryFee}</span>
              <span>{formatMoney(preview.deliveryFeeCents, "EGP", locale)}</span>
            </div>
          )}
          {preview.discountTotalCents > 0 && (
            <div className="flex justify-between text-secondary">
              <span>{dict.checkout.discount}</span>
              <span>-{formatMoney(preview.discountTotalCents, "EGP", locale)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-outline-variant/60 pt-2 font-semibold text-on-surface">
            <span>{dict.checkout.total}</span>
            <span>{formatMoney(preview.grandTotalCents, "EGP", locale)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
