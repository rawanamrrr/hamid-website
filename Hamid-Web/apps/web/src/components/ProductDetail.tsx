"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { addToCartAction } from "@/lib/cart/actions";
import type { StoreProductDetailView } from "@/lib/store/queries";

export function ProductDetail({
  product,
  dict,
}: {
  product: StoreProductDetailView;
  dict: { addToCart: string; added: string; outOfStock: string };
}) {
  const images = product.images.length > 0 ? product.images : [{ url: product.image, alt: product.alt }];
  const [activeImage, setActiveImage] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const outOfStock = product.stockQty <= 0;

  function handleAddToCart() {
    setError(null);
    startTransition(async () => {
      const res = await addToCartAction(product.id, quantity);
      if ("error" in res) {
        setError(res.error);
        return;
      }
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    });
  }

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {/* Gallery */}
      <div>
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#f2d5ba]">
          {!imgError && images[activeImage] ? (
            <Image
              src={images[activeImage]!.url}
              alt={images[activeImage]!.alt}
              fill
              className="object-cover"
              unoptimized
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="material-symbols-outlined text-6xl text-[#947f78]">local_cafe</span>
            </div>
          )}
          {product.badge && (
            <span className="absolute top-4 start-4 rounded-full bg-[#7b5800] px-3 py-1 text-xs uppercase tracking-tighter text-white">
              {product.badge}
            </span>
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-4 flex gap-3">
            {images.map((img, i) => (
              <button
                key={img.url + i}
                type="button"
                onClick={() => {
                  setActiveImage(i);
                  setImgError(false);
                }}
                className={`h-16 w-16 overflow-hidden rounded-xl border-2 ${i === activeImage ? "border-[#7b5800]" : "border-transparent"}`}
              >
                <Image src={img.url} alt={img.alt} width={64} height={64} unoptimized className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div>
        {product.rating != null && (
          <span className="mb-2 flex items-center gap-1 text-xs font-semibold text-[#7b5800]">
            <span aria-hidden="true" className="flex items-center gap-1">
              {product.rating}{" "}
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            </span>
            <span className="sr-only">{product.rating} out of 5 stars</span>
          </span>
        )}
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl font-bold text-black md:text-4xl">{product.name}</h1>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="text-2xl font-semibold text-[#7b5800]">{product.price}</span>
          {product.compareAtPrice && <span className="text-lg text-[#947f78] line-through">{product.compareAtPrice}</span>}
        </div>

        {product.description && <p className="mt-6 leading-relaxed text-[#4f4541]">{product.description}</p>}
        {product.notes && <p className="mt-3 text-sm italic leading-relaxed text-[#817570]">{product.notes}</p>}

        {outOfStock ? (
          <p className="mt-8 text-sm font-semibold text-error">{dict.outOfStock}</p>
        ) : (
          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center gap-3 rounded-full border border-[#817570]/40 px-2 py-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#271908] hover:bg-[#f2d5ba]"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stockQty, q + 1))}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#271908] hover:bg-[#f2d5ba]"
              >
                <Plus size={14} />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={pending}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-black text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#7b5800] disabled:opacity-60"
            >
              {added ? "✓" : <ShoppingCart size={16} />}
              {added ? dict.added : dict.addToCart}
            </button>
          </div>
        )}
        {error && <p className="mt-3 text-sm text-error">{error}</p>}
      </div>
    </div>
  );
}
