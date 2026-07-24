import type { MenuSectionView as MenuSection } from "@/lib/menu/queries";
import { IntroHeroBackground } from "./IntroHeroBackground";
import { ScrollToTop } from "./ScrollToTop";
import { MenuBookCarousel } from "./MenuBookCarousel";

// ─── Main page content — a Server Component. Only IntroHeroBackground and
// MenuBookCarousel need client-side JS (the hero crossfade timer, and the
// carousel's drag/flip state respectively); everything else here is static
// markup. ──────────────────────────────────────────────────────────────
export default function MenuPageClient({ sections, heroImages }: { sections: MenuSection[]; heroImages: string[] }) {
  return (
    <div className="min-h-screen bg-[#fff8f4]">
      <ScrollToTop />
      {/* ── Compact intro ────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#271908] px-5 py-12 text-center md:px-16 md:py-16">
        <IntroHeroBackground images={heroImages} />
        <div className="relative z-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#c8a97a]">
            Hamid Afandi
          </p>
          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl font-bold text-white md:text-5xl">
            Our Menu
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/70 md:text-base">
            Every category has its own story — browse by what catches your eye.
          </p>
        </div>
      </div>

      {/* ── Book-style carousel — flip categories by dragging with your
          finger/cursor, on every screen size. ──────────────────────────── */}
      <MenuBookCarousel sections={sections} />

      {/* ── Footer CTA ──────────────────────────────────────────────────── */}
      <div className="bg-[#271908] py-12 md:py-16 px-5 text-center mt-4">
        <p className="text-[#c8a97a] text-xs font-semibold uppercase tracking-[0.2em] mb-3">
          Can&apos;t decide?
        </p>
        <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl md:text-3xl font-bold text-white mb-4">
          Visit Us In Person
        </h2>
        <p className="text-white/80 text-sm max-w-sm mx-auto mb-6">
          Come experience the aromas, the warmth, and the heritage — in our
          Mansoura branch.
        </p>
        <a
          href="/branches"
          className="inline-flex items-center gap-2 bg-[#7b5800] text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#5d4200] transition-colors"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[16px] select-none">location_on</span>
          Find Our Branch
        </a>
      </div>
    </div>
  );
}
