import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";

const origins = [
  { name: "Ethiopia", flag: "🇪🇹", description: "Bright floral notes, sparkling citrus acidity, jasmine finish." },
  { name: "Brazil", flag: "🇧🇷", description: "Chocolate body, low acidity, nutty sweetness." },
  { name: "Colombia", flag: "🇨🇴", description: "Balanced, caramel sweetness with a mild fruit undertone." },
  { name: "Yemen", flag: "🇾🇪", description: "Wild, complex, wine-like with a distinctive earthy depth." },
];

export default function CoffeePage() {
  const coffeeProducts = products.filter((p) => p.category === "beans" || p.category === "espresso");

  return (
    <div>
      {/* Hero */}
      <section className="py-24 px-16 max-w-[1280px] mx-auto text-center space-y-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7b5800]">The Bean Journey</span>
        <h1 className="font-[family-name:var(--font-plus-jakarta)] text-5xl font-bold text-black">
          Our Coffee Collection
        </h1>
        <p className="text-[#4f4541] text-lg max-w-2xl mx-auto">
          Sourced from the world&apos;s finest growing regions, each bean is selected by our master roasters for its unique character and terroir.
        </p>
      </section>

      {/* Origins */}
      <section className="py-16 bg-[#ffead8]">
        <div className="px-16 max-w-[1280px] mx-auto">
          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-[32px] font-semibold text-black mb-12 text-center">
            Coffee Origins
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {origins.map(({ name, flag, description }) => (
              <div key={name} className="bg-white rounded-2xl p-8 luxury-shadow text-center space-y-4">
                <span className="text-5xl">{flag}</span>
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-semibold text-black">{name}</h3>
                <p className="text-[#4f4541] text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 px-16 max-w-[1280px] mx-auto">
        <h2 className="font-[family-name:var(--font-plus-jakarta)] text-[32px] font-semibold text-black mb-12">
          Shop Coffee
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {coffeeProducts.map((p) => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </section>
    </div>
  );
}
