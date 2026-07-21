"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { CheckCircle2, ShoppingCart, X } from "lucide-react";

const AUTO_DISMISS_MS = 5000;

/**
 * Toast dropdown anchored directly under the cart icon — rendered by Navbar
 * inside a `relative` wrapper around the actual cart link, so it's
 * `absolute` positioned off that wrapper's own box rather than guessing a
 * fixed viewport offset (which drifted away from the icon on desktop, where
 * the "Order Now" button sits after it). Deliberately not a full-screen
 * modal, so it never blocks the rest of the page. z-[95] keeps it above the
 * sticky nav (z-50) and the mobile checkout summary bar (z-40).
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
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(onClose, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="status"
      className="absolute end-2 top-full z-[95] mt-3 w-[calc(100vw-2rem)] max-w-[300px] rounded-2xl border border-outline-variant/60 bg-white shadow-2xl sm:end-0 sm:w-[300px]"
    >
      <div className="flex items-center justify-between gap-2 p-3.5 pb-2.5 sm:p-4 sm:pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <CheckCircle2 size={18} className="shrink-0 text-[#2e7d32] sm:size-5" />
          <p className="truncate font-[family-name:var(--font-plus-jakarta)] text-xs font-bold text-[#271908] sm:text-sm">
            {labels.title}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#817570] hover:bg-[#f2d5ba]/60"
        >
          <X size={15} />
        </button>
      </div>

      {(productImage || productName) && (
        <div className="flex items-center gap-2.5 px-3.5 pb-2.5 sm:gap-3 sm:px-4 sm:pb-3">
          {productImage && (
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-[#f2d5ba] sm:h-12 sm:w-12">
              <Image src={productImage} alt="" fill unoptimized className="object-cover" />
            </div>
          )}
          <div className="min-w-0">
            {productName && <p className="truncate text-xs font-semibold text-[#271908] sm:text-sm">{productName}</p>}
            {productMeta && <p className="truncate text-[11px] text-[#817570] sm:text-xs">{productMeta}</p>}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 p-3.5 pt-1 sm:p-4 sm:pt-1">
        <Link
          href="/cart"
          className="flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-[#271908] text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#7b5800]"
        >
          <ShoppingCart size={14} />
          {labels.goToCart}
        </Link>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-full items-center justify-center rounded-full border border-[#271908]/20 text-[11px] font-semibold uppercase tracking-wide text-[#271908] transition-colors hover:bg-[#f2d5ba]/40"
        >
          {labels.continueShopping}
        </button>
      </div>
    </div>
  );
}
