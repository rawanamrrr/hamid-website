"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ShoppingCart, X } from "lucide-react";

/**
 * Toast dropdown anchored directly under the cart icon — rendered by Navbar
 * inside a `relative` wrapper around the actual cart link, so it's
 * `absolute` positioned off that wrapper's own box rather than guessing a
 * fixed viewport offset (which drifted away from the icon on desktop, where
 * the "Order Now" button sits after it). Deliberately not a full-screen
 * modal, so it never blocks the rest of the page. z-[95] keeps it above the
 * sticky nav (z-50) and the mobile checkout summary bar (z-40).
 *
 * Stays open until the user explicitly clicks "Go to Cart", "Continue Shopping",
 * or the close button.
 */
export function AddedToCartDialog({
  open,
  onClose,
  productName,
  productImage,
  productMeta,
  labels,
}: {
  open: boolean;
  onClose: () => void;
  productName?: string;
  /** Small thumbnail shown next to the product name — omitted if not provided. */
  productImage?: string | null;
  /** e.g. "Coffee Beans · 245 EGP" — shown under the product name. */
  productMeta?: string;
  labels: { title: string; continueShopping: string; goToCart: string };
}) {
  if (!open) return null;

  return (
    <div
      role="status"
      className="fixed bottom-5 start-4 end-4 z-[999] mx-auto max-w-[340px] rounded-2xl border border-outline-variant/60 bg-white p-1 shadow-[0_20px_50px_rgba(0,0,0,0.3)] sm:absolute sm:bottom-auto sm:top-full sm:end-0 sm:start-auto sm:mt-3 sm:w-[300px] sm:max-w-none sm:p-0"
    >
      <div className="flex items-center justify-between gap-2 p-3.5 pb-2.5 sm:p-4 sm:pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <CheckCircle2 size={18} className="shrink-0 text-[#2e7d32] sm:size-5" />
          <p className="truncate font-[family-name:var(--font-plus-jakarta)] text-xs font-bold text-[#000000] sm:text-sm">
            {labels.title}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#8E7B6A] hover:bg-[#FCE8CD]/60"
        >
          <X size={15} />
        </button>
      </div>

      {(productImage || productName) && (
        <div className="flex items-center gap-2.5 px-3.5 pb-2.5 sm:gap-3 sm:px-4 sm:pb-3">
          {productImage && (
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#FCE8CD] sm:h-12 sm:w-12">
              <Image src={productImage} alt="" fill unoptimized className="object-cover" />
            </div>
          )}
          <div className="min-w-0">
            {productName && <p className="truncate text-xs font-semibold text-[#000000] sm:text-sm">{productName}</p>}
            {productMeta && <p className="truncate text-[11px] text-[#8E7B6A] sm:text-xs">{productMeta}</p>}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 p-3.5 pt-1 sm:p-4 sm:pt-1">
        <Link
          href="/cart"
          onClick={onClose}
          className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-[#000000] text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#57392D]"
        >
          <ShoppingCart size={14} />
          {labels.goToCart}
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-full items-center justify-center rounded-full border border-[#000000]/20 text-[11px] font-semibold uppercase tracking-wide text-[#000000] transition-colors hover:bg-[#FCE8CD]/40"
        >
          {labels.continueShopping}
        </button>
      </div>
    </div>
  );
}
