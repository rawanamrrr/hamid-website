import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

const categories = ["all", "beans", "turkish", "espresso", "accessories", "gifts"] as const;

export default function StorePage() {
  return (
    <div className="min-h-screen">
      {/* Hero banner */}
      <div className="bg-[#271908] py-14 md:py-24 px-5 md:px-16 text-center">
        <p className="text-[#c8a97a] text-xs font-semibold uppercase tracking-widest mb-3">Hamid Afandi</p>
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl md:text-5xl font-bold text-white mb-4">
          Our Store
        </h1>
        <p className="text-white/60 text-sm md:text-lg max-w-xl mx-auto">
          Every product is a story of craftsmanship, origin, and passion.
        </p>
      </div>

      <div className="py-10 md:py-16 px-5 md:px-16 max-w-[1280px] mx-auto">
        {/* Category filters — horizontal scroll on mobile */}
        <div className="flex gap-2 md:gap-4 overflow-x-auto no-scrollbar pb-2 mb-8 md:mb-12 md:flex-wrap md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              className="flex-shrink-0 px-5 py-2 rounded-full border border-[#817570] text-xs font-semibold uppercase tracking-widest hover:bg-black hover:text-white hover:border-black transition-all capitalize whitespace-nowrap"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products grid — 2 cols on mobile, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </div>
  );
}
