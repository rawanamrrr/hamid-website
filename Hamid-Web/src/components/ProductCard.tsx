"use client";
import Image from "next/image";
import { useState } from "react";

interface ProductCardProps {
  name: string;
  price: string;
  rating: number;
  tag: string;
  badge?: string;
  image: string;
  alt: string;
}

export default function ProductCard({ name, price, rating, tag, badge, image, alt }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group luxury-shadow bg-[#fff1e6] rounded-[1.75rem] overflow-hidden transition-all duration-500 hover:-translate-y-2 flex flex-col">
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
      <div className="p-6 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#7b5800] flex items-center gap-1 text-xs font-semibold">
              {rating}{" "}
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
            </span>
            <span className="text-[#4f4541] text-xs">{tag}</span>
          </div>
          <h3 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-semibold text-black leading-snug line-clamp-2 min-h-[56px]">
            {name}
          </h3>
        </div>
        <div>
          <p className="text-[#7b5800] font-[family-name:var(--font-plus-jakarta)] text-2xl font-semibold mb-3">
            {price}
          </p>
          <button className="w-full bg-black text-white py-4 rounded-2xl text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-[#7b5800] transition-colors">
            Add to Cart <span className="material-symbols-outlined text-[18px]">shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
