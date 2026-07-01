import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

export default function FeaturedProducts() {
  const featured = products.slice(0, 4);

  return (
    <section className="py-12 md:py-20 px-5 md:px-16 max-w-[1280px] mx-auto">
      <div className="flex justify-between items-end mb-8 md:mb-12">
        <div>
          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl md:text-[32px] font-semibold text-black">
            Featured Coffee
          </h2>
          <p className="text-[#4f4541] text-sm md:text-base mt-1 md:mt-2">Handpicked blends, roasted to perfection.</p>
        </div>
        <Link href="/menu" className="text-[#7b5800] text-sm font-semibold hover:underline">
          View All
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {featured.map((p) => (
          <ProductCard key={p.id} {...p} />
        ))}
      </div>
    </section>
  );
}
