import Image from "next/image";
import Link from "next/link";
import { getBestSellerProducts } from "@/lib/store/queries";
import { getLocale, getDict } from "@/lib/i18n";

export default async function BestSellers() {
  const [locale, dict] = await Promise.all([getLocale(), getDict()]);
  const bestSellers = await getBestSellerProducts(locale, 8);

  if (bestSellers.length === 0) return null;

  return (
    <section className="py-12 md:py-20 bg-[#fff8f4]">
      <div className="px-5 md:px-16 max-w-[1280px] mx-auto">
        <div className="flex justify-between items-center mb-8 md:mb-12">
          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl md:text-[32px] font-semibold text-black">
            {dict.home.bestSellers.title}
          </h2>
          <div className="hidden md:flex gap-4">
            <button className="w-12 h-12 rounded-full border border-[#817570] flex items-center justify-center hover:bg-black hover:text-white transition-all">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-12 h-12 rounded-full border border-[#817570] flex items-center justify-center hover:bg-black hover:text-white transition-all">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="flex gap-4 md:gap-6 overflow-x-auto no-scrollbar pb-4 -mx-5 px-5 md:-mx-0 md:px-0">
          {bestSellers.map((p) => (
            <Link
              key={p.id}
              href={`/store/${p.slug}`}
              className="min-w-[220px] md:min-w-[300px] flex-shrink-0 group luxury-shadow bg-white rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2"
            >
              <div className="h-44 md:h-64 overflow-hidden relative bg-[#f2d5ba]">
                <Image src={p.image} alt={p.alt} fill className="object-cover" unoptimized />
              </div>
              <div className="p-4 md:p-6 space-y-1 md:space-y-2">
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-base md:text-2xl font-semibold text-black leading-snug">
                  {p.name}
                </h3>
                <p className="text-[#4f4541] text-xs">{p.tag}</p>
                <p className="text-[#7b5800] font-bold text-sm md:text-base">{p.price}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile scroll hint */}
        <p className="text-center text-xs text-[#817570] mt-4 md:hidden">{dict.home.bestSellers.swipeHint}</p>
      </div>
    </section>
  );
}
