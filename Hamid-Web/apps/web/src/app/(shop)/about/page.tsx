import type { Metadata } from "next";
import Image from "next/image";
import { getAboutHero } from "@/lib/content/queries";
import { getDict } from "@/lib/i18n";
import { SocialIconLinks } from "@/components/social-links";
import About from "@/sections/About";
import ImmersiveExperience from "@/sections/ImmersiveExperience";
import InstagramGallery from "@/sections/InstagramGallery";
import Newsletter from "@/sections/Newsletter";

export const metadata: Metadata = {
  title: "Our Story | Hamid Afandi",
  description: "From a single coffee cart in downtown Cairo to a beloved Egyptian heritage coffee brand.",
};

/** Shown until an image is set in Admin → About Page (or the DB is briefly unreachable). */
const FALLBACK_HERO_IMAGE =
  "/photos/story.jpg";

const STORY_IMAGES = [
  "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1200&q=80",
  "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80",
  "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1200&q=80",
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80",
  "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80",
];

export default async function AboutPage() {
  const [heroImage, dict] = await Promise.all([
    getAboutHero().catch(() => null).then((v) => v ?? FALLBACK_HERO_IMAGE),
    getDict(),
  ]);

  const values = [
    { icon: "eco", title: dict.aboutPage.value1Title, desc: dict.aboutPage.value1Desc },
    { icon: "local_cafe", title: dict.aboutPage.value2Title, desc: dict.aboutPage.value2Desc },
    { icon: "history_edu", title: dict.aboutPage.value3Title, desc: dict.aboutPage.value3Desc },
    { icon: "groups", title: dict.aboutPage.value4Title, desc: dict.aboutPage.value4Desc },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[380px] md:h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroImage}')` }} />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 text-center text-white space-y-4 px-5">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFE2C6]">{dict.aboutPage.since}</span>
          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl md:text-5xl font-bold">{dict.aboutPage.title}</h1>
          <p className="text-[#FEE5C9] text-base md:text-lg max-w-xl mx-auto">{dict.aboutPage.subtitle}</p>
        </div>
      </section>

      {/* Story — alternating image / text chapters */}
      <section className="py-14 md:py-24 px-5 md:px-16 max-w-[1280px] mx-auto space-y-16 md:space-y-28">
        {dict.aboutPage.chapters.map((chapter, i) => (
          <div key={chapter.title} className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className={`relative ${i % 2 === 1 ? "md:order-2" : ""}`}>
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden luxury-shadow">
                <Image
                  src={STORY_IMAGES[i % STORY_IMAGES.length]}
                  alt={chapter.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <span
                aria-hidden="true"
                className={`hidden md:flex absolute -bottom-6 ${i % 2 === 1 ? "-start-6" : "-end-6"} h-20 w-20 items-center justify-center rounded-full bg-[#57392D] text-[#FFE2C6] font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold shadow-lg`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="space-y-4">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#57392D]">{chapter.kicker}</span>
              <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl md:text-4xl font-bold text-black leading-tight">
                {chapter.title}
              </h2>
              <div className="h-0.5 w-14 bg-[#57392D]" />
              <p className="text-[#4A3026] text-base md:text-lg leading-relaxed">{chapter.body}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Quote + promise */}
      <section className="relative overflow-hidden bg-[#57392D] py-16 md:py-24 px-5 md:px-16">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: `url('${STORY_IMAGES[0]}')` }}
        />
        <div className="relative max-w-3xl mx-auto text-center text-white space-y-10">
          <p className="font-[family-name:var(--font-plus-jakarta)] text-2xl md:text-4xl font-bold leading-snug">
            &ldquo;{dict.aboutPage.quote}&rdquo;
          </p>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#FFE2C6] mb-5">{dict.aboutPage.promiseTitle}</p>
            <div className="grid sm:grid-cols-3 gap-4">
              {dict.aboutPage.promises.map((promise) => (
                <div key={promise} className="rounded-2xl border border-[#FFE2C6]/30 bg-white/5 px-4 py-5 text-sm md:text-base">
                  {promise}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-[family-name:var(--font-plus-jakarta)] text-xl md:text-2xl font-bold">{dict.aboutPage.storySignatureName}</p>
            <p className="mt-2 italic text-[#FFE2C6]">{dict.aboutPage.storySignatureTagline}</p>
          </div>
        </div>
      </section>

      {/* Heritage in Every Single Detail Section */}
      <About showCta={false} />

      {/* Values */}
      <section className="py-12 md:py-20 bg-[#FFE2C6]">
        <div className="px-5 md:px-16 max-w-[1280px] mx-auto">
          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl md:text-[32px] font-semibold text-black mb-8 md:mb-12 text-center">
            {dict.aboutPage.valuesTitle}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {values.map(({ icon, title, desc }) => (
              <div key={title} className="text-center space-y-2.5 md:space-y-4">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#57392D] flex items-center justify-center mx-auto">
                  <span aria-hidden="true" className="material-symbols-outlined text-white text-xl md:text-2xl">{icon}</span>
                </div>
                <h3 className="font-[family-name:var(--font-plus-jakarta)] text-base md:text-xl font-semibold text-black">{title}</h3>
                <p className="text-[#4A3026] text-xs md:text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Coffee Experience Section */}
      <ImmersiveExperience />

      {/* From Our Instagram Section */}
      <InstagramGallery />

      {/* Follow us */}
      <section className="py-12 md:py-20 px-5 md:px-16 max-w-[1280px] mx-auto text-center">
        <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl md:text-[32px] font-semibold text-black mb-3">
          {dict.aboutPage.followTitle}
        </h2>
        <p className="text-[#4A3026] max-w-md mx-auto mb-8">{dict.aboutPage.followBody}</p>
        <SocialIconLinks
          className="flex justify-center gap-4"
          iconClassName="w-5 h-5"
          linkClassName="border-[#e8d5bc] text-[#57392D] hover:border-[#57392D] hover:bg-[#57392D] hover:text-white"
        />
      </section>

      {/* Join Our Coffee Circle (Newsletter) Section */}
      <Newsletter dict={dict} />
    </div>
  );
}
