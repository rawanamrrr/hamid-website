import type { Metadata } from "next";
import { getAboutHero } from "@/lib/content/queries";
import { SocialIconLinks } from "@/components/social-links";

export const metadata: Metadata = {
  title: "Our Story | Hamid Afandi",
  description: "From a single coffee cart in downtown Cairo to a beloved Egyptian heritage coffee brand.",
};

const values = [
  { icon: "eco", title: "Ethical Sourcing", desc: "We partner directly with farmers who share our values of sustainability and fair trade." },
  { icon: "local_cafe", title: "Artisan Roasting", desc: "Small-batch roasting in Cairo preserves the nuance of every origin we source." },
  { icon: "history_edu", title: "Heritage First", desc: "Every product design and brewing method honors centuries of Egyptian coffee culture." },
  { icon: "groups", title: "Community", desc: "Our branches are gathering places — spaces for conversation, culture, and connection." },
];

/** Shown until an image is set in Admin → About Page (or the DB is briefly unreachable). */
const FALLBACK_HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAkH61wZIeWDQVG7XwTYY-UgMR2izAozhpZN5O6mWPcOyaus5yRNk_4n4oibOL05Z6PrWnyq76Jyy5DN9vmYgILrOgkzm4Oy6FC5dw0xb0xW4srS8s4ZEY0_T6tGzyD5JRX6LfFNSUN3PK8-cDZEYEsfbXz3eK4r7CtXVCbbkzsTPCN-Wfxd-atfgg_0HdgsC5ePQxQ_jLN7ql_uko3b4gM2z1UkjdrnsC4QwCnNZVmQGX_y9Xy9DUhIB9X7Mkg6Tz7G9v1tSlk37s6";

export default async function AboutPage() {
  const heroImage = (await getAboutHero().catch(() => null)) ?? FALLBACK_HERO_IMAGE;

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[380px] md:h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroImage}')` }} />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 text-center text-white space-y-4 px-5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7b5800]">Since 1952</span>
          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl md:text-5xl font-bold">Our Story</h1>
          <p className="text-[#D9C1AA] text-base md:text-lg max-w-xl mx-auto">
            From a single coffee cart in downtown Cairo to a beloved heritage brand.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-12 md:py-20 px-5 md:px-16 max-w-[1280px] mx-auto">
        <div className="max-w-3xl mx-auto space-y-5 md:space-y-6 text-[#4f4541] text-base md:text-lg leading-relaxed text-center">
          <p>
            Hamid Afandi Coffee was born from a grandfather&apos;s passion. In 1952, Hamid Afandi began roasting beans in a small cart near Al-Hussein Mosque in Islamic Cairo, serving the neighborhood&apos;s merchants, artists, and intellectuals.
          </p>
          <p>
            His secret was simple: source only the best, roast with patience, and serve with pride. Three generations later, we carry that same philosophy into every bag we produce and every branch we open.
          </p>
          <p>
            We source our beans directly from farmers in Ethiopia, Brazil, Colombia, and Yemen — building relationships that last decades. Each harvest is cupped, graded, and roasted in our Cairo facility before reaching your cup.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-12 md:py-20 bg-[#ffead8]">
        <div className="px-5 md:px-16 max-w-[1280px] mx-auto">
          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl md:text-[32px] font-semibold text-black mb-8 md:mb-12 text-center">
            What We Stand For
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {values.map(({ icon, title, desc }) => (
              <div key={title} className="text-center space-y-2.5 md:space-y-4">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#7b5800] flex items-center justify-center mx-auto">
                  <span aria-hidden="true" className="material-symbols-outlined text-white text-xl md:text-2xl">{icon}</span>
                </div>
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-base md:text-xl font-semibold text-black">{title}</h3>
                <p className="text-[#4f4541] text-xs md:text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Follow us */}
      <section className="py-12 md:py-20 px-5 md:px-16 max-w-[1280px] mx-auto text-center">
        <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl md:text-[32px] font-semibold text-black mb-3">
          Follow Our Journey
        </h2>
        <p className="text-[#4f4541] max-w-md mx-auto mb-8">
          Behind-the-scenes roasting, new blends, and life at our branch — follow along on social media.
        </p>
        <SocialIconLinks
          className="flex justify-center gap-4"
          iconClassName="w-5 h-5"
          linkClassName="border-[#e8d5bc] text-[#7b5800] hover:border-[#7b5800] hover:bg-[#7b5800] hover:text-white"
        />
      </section>
    </div>
  );
}
