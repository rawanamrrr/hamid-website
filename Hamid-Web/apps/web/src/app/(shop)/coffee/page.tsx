import type { Metadata } from "next";
import ProductCard from "@/components/ProductCard";
import { getStoreProducts } from "@/lib/store/queries";
import { getLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Our Coffee | Hamid Afandi",
  description: "Explore our coffee origins — Ethiopia, Brazil, Colombia, and Yemen.",
};

const origins = [
  { name: "Ethiopia", icon: "local_florist", description: "Bright floral notes, sparkling citrus acidity, jasmine finish." },
  { name: "Brazil", icon: "cookie", description: "Chocolate body, low acidity, nutty sweetness." },
  { name: "Colombia", icon: "eco", description: "Balanced, caramel sweetness with a mild fruit undertone." },
  { name: "Yemen", icon: "landscape", description: "Wild, complex, wine-like with a distinctive earthy depth." },
];

export default async function CoffeePage() {
  const locale = await getLocale();
  const allProducts = await getStoreProducts(locale);
  const coffeeProducts = allProducts.filter((p) => p.categorySlug === "beans" || p.categorySlug === "espresso");

  return (
    <div>
      {/* Hero */}
      <section className="py-14 md:py-24 px-5 md:px-16 max-w-[1280px] mx-auto text-center space-y-4 md:space-y-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7b5800]">The Bean Journey</span>
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl md:text-5xl font-bold text-black">
          Our Coffee Collection
        </h1>
        <p className="text-[#4f4541] text-base md:text-lg max-w-2xl mx-auto">
          Sourced from the world&apos;s finest growing regions, each bean is selected by our master roasters for its unique character and terroir.
        </p>
      </section>

      {/* Origins */}
      <section className="py-12 md:py-16 bg-[#ffead8]">
        <div className="px-5 md:px-16 max-w-[1280px] mx-auto">
          <span className="block text-center text-xs font-semibold uppercase tracking-[0.2em] text-[#7b5800] mb-2 md:mb-3">
            Sourced With Care
          </span>
          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl md:text-[32px] font-semibold text-black mb-8 md:mb-12 text-center">
            Coffee Origins
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {origins.map(({ name, icon, description }) => (
              <div
                key={name}
                className="group bg-white rounded-2xl md:rounded-[1.5rem] p-5 md:p-8 luxury-shadow text-center space-y-3 md:space-y-4 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_36px_-14px_rgba(39,25,8,0.3)]"
              >
                <div className="mx-auto flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-[#fff1e6] transition-colors duration-300 group-hover:bg-[#7b5800]">
                  <span
                    aria-hidden="true"
                    className="material-symbols-outlined text-2xl md:text-3xl text-[#7b5800] transition-colors duration-300 group-hover:text-white"
                  >
                    {icon}
                  </span>
                </div>
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-lg md:text-xl font-semibold text-black">{name}</h3>
                <p className="text-[#4f4541] text-xs md:text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-12 md:py-20 px-5 md:px-16 max-w-[1280px] mx-auto">
        <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl md:text-[32px] font-semibold text-black mb-8 md:mb-12">
          Shop Coffee
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {coffeeProducts.map((p) => (
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
            />
          ))}
        </div>
      </section>
    </div>
  );
}
