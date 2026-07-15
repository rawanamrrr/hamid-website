"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";
import { addToCartAction } from "@/lib/cart/actions";

interface ProductCardProps {
  productId?: number;
  slug?: string;
  name: string;
  price: string;
  rating: number | null;
  tag: string;
  badge?: string;
  image: string;
  alt: string;
  addToCartLabel?: string;
  addedLabel?: string;
}

export default function ProductCard({
  productId,
  slug,
  name,
  price,
  rating,
  tag,
  badge,
  image,
  alt,
  addToCartLabel = "Add to Cart",
  addedLabel = "Added ✓",
}: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [pending, startTransition] = useTransition();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    if (!productId) return;
    startTransition(async () => {
      const res = await addToCartAction(productId, 1);
      if (!("error" in res)) {
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
      }
    });
  }

  const ImageBlock = (
    <div className="h-72 overflow-hidden relative bg-[#f2d5ba] flex-shrink-0">
      {!imgError ? (
        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          unoptimized
          onError={() => setImgError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="material-symbols-outlined text-[#947f78] text-6xl">local_cafe</span>
        </div>
      )}
      {badge && (
        <span className="absolute top-4 left-4 bg-[#7b5800] text-white px-3 py-1 rounded-full text-xs uppercase tracking-tighter">
          {badge}
        </span>
      )}
    </div>
  );

  const InfoBlock = (
    <div>
      <div className="flex justify-between items-center mb-2">
        {rating != null ? (
          <span className="text-[#7b5800] flex items-center gap-1 text-xs font-semibold">
            {rating}{" "}
            <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
          </span>
        ) : (
          <span />
        )}
        <span className="text-[#4f4541] text-xs">{tag}</span>
      </div>
      <h3 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-semibold text-black leading-snug line-clamp-2 min-h-[56px]">
        {name}
      </h3>
    </div>
  );

  return (
    <div className="group luxury-shadow bg-[#fff1e6] rounded-[1.75rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col">
      {slug ? (
        <Link href={`/store/${slug}`}>{ImageBlock}</Link>
      ) : (
        ImageBlock
      )}
      <div className="p-6 flex flex-col flex-1 justify-between gap-3">
        {slug ? <Link href={`/store/${slug}`}>{InfoBlock}</Link> : InfoBlock}
        <div>
          <p className="text-[#7b5800] font-[family-name:var(--font-plus-jakarta)] text-2xl font-semibold mb-3">
            {price}
          </p>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={pending || !productId}
            className="w-full bg-black text-white py-4 rounded-2xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-[#7b5800] transition-colors disabled:opacity-60"
          >
            {added ? addedLabel : addToCartLabel}{" "}
            <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
