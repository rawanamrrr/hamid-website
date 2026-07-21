"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { MenuSectionView as MenuSection, MenuItemView as MenuItem } from "@/lib/menu/queries";

// ─── Badge colour mapping ──────────────────────────────────────────────────
const BADGE_STYLES: Record<string, string> = {
  Popular:  "bg-[#7b5800]/10 text-[#7b5800] border border-[#7b5800]/20",
  New:      "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Seasonal: "bg-sky-50 text-sky-700 border border-sky-200",
  Heritage: "bg-[#271908]/8 text-[#271908] border border-[#271908]/15",
};

/** Full-bleed image with a graceful icon fallback — shared by the grid tile and section banner. */
function CategoryVisual({ section, sizes }: { section: MenuSection; sizes: string }) {
  const [imgError, setImgError] = useState(false);
  if (section.image && !imgError) {
    return (
      <Image
        src={section.image}
        alt=""
        fill
        unoptimized
        sizes={sizes}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        onError={() => setImgError(true)}
      />
    );
  }
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#3a2614] to-[#1a1006]">
      <span aria-hidden="true" className="material-symbols-outlined text-5xl text-[#c8a97a]/70">
        {section.icon}
      </span>
    </div>
  );
}

// ─── Category grid tile (the page's visual centrepiece) ───────────────────
function CategoryTile({ section }: { section: MenuSection }) {
  return (
    <a
      href={`#${section.id}`}
      className="group relative aspect-square sm:aspect-[3/4] overflow-hidden rounded-2xl sm:rounded-[1.5rem] bg-[#1a1006] shadow-[0_8px_24px_-8px_rgba(39,25,8,0.35)]"
    >
      <CategoryVisual section={section} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-3.5 md:p-4">
        <p className="font-[family-name:var(--font-plus-jakarta)] text-[15px] md:text-lg font-bold leading-tight text-white">
          {section.title}
        </p>
        <p className="mt-0.5 text-[11px] font-medium text-white/70">
          {section.items.length} {section.items.length === 1 ? "item" : "items"}
        </p>
      </div>
    </a>
  );
}

// ─── Single menu item card ─────────────────────────────────────────────────
function MenuItemCard({ item }: { item: MenuItem }) {
  const singleSize = item.sizes.length === 1;

  return (
    <div className="group flex flex-col justify-between rounded-2xl sm:rounded-[1.25rem] border border-[#e8d5bc]/40 bg-white p-3.5 sm:p-5 shadow-[0_2px_10px_-4px_rgba(39,25,8,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c8a97a]/60 hover:shadow-[0_10px_24px_-8px_rgba(39,25,8,0.18)]">
      <div className="space-y-1 sm:space-y-1.5">
        {item.badge && (
          <span
            className={`inline-block text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full ${
              BADGE_STYLES[item.badge] ?? "bg-[#7b5800]/10 text-[#7b5800]"
            }`}
          >
            {item.badge}
          </span>
        )}
        <h3 className="font-[family-name:var(--font-plus-jakarta)] text-[13px] sm:text-[15px] font-semibold text-[#271908] leading-snug">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-[#4f4541] text-[11px] sm:text-xs leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}
      </div>

      <div className="mt-3 sm:mt-4 border-t border-[#e8d5bc]/50 pt-2.5 sm:pt-3">
        {singleSize ? (
          <span className="font-[family-name:var(--font-plus-jakarta)] text-sm sm:text-base font-bold text-[#7b5800]">
            {item.sizes[0].price}
          </span>
        ) : (
          <ul className="space-y-0.5 sm:space-y-1">
            {item.sizes.map((s) => (
              <li key={s.size} className="flex items-center justify-between gap-2 text-xs sm:text-sm">
                <span className="text-[#4f4541] truncate">{s.size}</span>
                <span className="font-[family-name:var(--font-plus-jakarta)] font-bold text-[#7b5800] whitespace-nowrap">{s.price}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ─── One full category section: panoramic banner + item grid ──────────────
function MenuSectionBlock({ section }: { section: MenuSection }) {
  return (
    <section id={section.id} className="scroll-mt-32">
      {/* Panoramic banner — the "instant recognition" moment as you scroll */}
      <div className="group relative mb-4 h-28 overflow-hidden rounded-2xl sm:rounded-[1.75rem] sm:h-44 md:h-52 md:mb-8">
        <CategoryVisual section={section} sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 sm:p-5 md:p-7">
          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-xl sm:text-2xl font-bold text-white md:text-4xl">
            {section.title}
          </h2>
          <span className="hidden shrink-0 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm sm:inline-block">
            {section.items.length} {section.items.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>

      {/* Items grid — two columns even on phones so the list stays scannable */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
        {section.items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

// ─── Sticky quick-jump nav ──────────────────────────────────────────────────
function StickyNav({
  sections,
  activeId,
}: {
  sections: MenuSection[];
  activeId: string;
}) {
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const activePill = nav.querySelector(`[data-id="${activeId}"]`) as HTMLElement | null;
    if (activePill) {
      activePill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeId]);

  return (
    <div
      className="sticky z-30 border-b border-[#e8d5bc]/50 bg-[#fff8f4]/90 backdrop-blur-md transition-[top] duration-300"
      style={{ top: "var(--nav-offset, 52px)" }}
    >
      <div
        ref={navRef}
        className="mx-auto flex max-w-[1280px] gap-1.5 overflow-x-auto no-scrollbar px-5 py-2.5 md:px-16"
      >
        {sections.map((s) => (
          <a
            key={s.id}
            data-id={s.id}
            href={`#${s.id}`}
            className={`flex-shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors duration-200 ${
              activeId === s.id
                ? "bg-[#271908] text-[#c8a97a]"
                : "bg-transparent text-[#817570] hover:bg-[#ffead8] hover:text-[#271908]"
            }`}
          >
            {s.title}
          </a>
        ))}
      </div>
    </div>
  );
}

const HERO_SLIDE_INTERVAL_MS = 6000;

// ─── Intro banner background — crossfades through the admin-managed hero images ─
function IntroHeroBackground({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (images.length < 2) return;
    const timer = setInterval(() => setActive((i) => (i + 1) % images.length), HERO_SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) return null;

  return (
    <div className="absolute inset-0 z-0">
      {images.map((url, i) => (
        <div
          key={url}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${
            i === active ? "opacity-100" : "opacity-0"
          }`}
          style={{ backgroundImage: `url('${url}')` }}
          aria-hidden={i !== active}
        />
      ))}
      <div className="absolute inset-0 bg-black/55" />
    </div>
  );
}

// ─── Main client component ─────────────────────────────────────────────────
export default function MenuPageClient({ sections, heroImages }: { sections: MenuSection[]; heroImages: string[] }) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  useEffect(() => {
    if (!sections.length) return;
    const observers: IntersectionObserver[] = [];

    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(section.id);
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  return (
    <div className="min-h-screen bg-[#fff8f4]">
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

      {/* ── Category showcase — instantly recognisable, no reading required ─ */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-5 py-6 sm:py-8 md:px-16 md:py-10">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 md:gap-4 lg:grid-cols-4">
          {sections.map((section) => (
            <CategoryTile key={section.id} section={section} />
          ))}
        </div>
      </div>

      {/* ── Sticky Section Nav ──────────────────────────────────────────── */}
      <StickyNav sections={sections} activeId={activeId} />

      {/* ── Menu Content ────────────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-5 md:px-16 py-8 md:py-14 space-y-10 sm:space-y-14 md:space-y-20">
        {sections.map((section) => (
          <MenuSectionBlock key={section.id} section={section} />
        ))}
      </div>

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
