import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { getFeaturedHomeProducts } from "@/lib/store/queries";
import { withDbTimeout } from "@/lib/db-timeout";
import { getLocale, getDict } from "@/lib/i18n";

export default async function FeaturedProducts() {
  const [locale, dict] = await Promise.all([getLocale(), getDict()]);
  // Skip the section entirely if the catalog can't be reached right now.
  const featured = await withDbTimeout(getFeaturedHomeProducts(locale, 4)).catch(() => []);

  if (featured.length === 0) return null;

  return (
    <section className="py-12 md:py-20 px-5 md:px-16 max-w-[1280px] mx-auto">
      <div className="flex justify-between items-end mb-8 md:mb-12">
        <div>
          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl md:text-[32px] font-semibold text-black">
            {dict.home.featured.title}
          </h2>
          <p className="text-[#4f4541] text-sm md:text-base mt-1 md:mt-2">{dict.home.featured.subtitle}</p>
        </div>
        <Link href="/store" className="text-[#7b5800] text-sm font-semibold hover:underline">
          {dict.home.featured.viewAll}
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {featured.map((p) => (
          <ProductCard
            key={p.id}
            productId={p.id}
            slug={p.slug}
            name={p.name}
            price={p.price}
            rating={p.rating}
            tag={p.tag}
            badge={p.badge}
            image={p.image}
            alt={p.alt}
            addToCartLabel={dict.product.addToCart}
            addedLabel={dict.product.added}
          />
        ))}
      </div>
    </section>
  );
}
