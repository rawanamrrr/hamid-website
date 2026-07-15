"use client";

import { useEffect, useRef, useState } from "react";
import type { MenuSectionView as MenuSection, MenuItemView as MenuItem } from "@/lib/menu/queries";

// ─── Badge colour mapping ──────────────────────────────────────────────────
const BADGE_STYLES: Record<string, string> = {
  Popular:  "bg-[#7b5800]/10 text-[#7b5800] border border-[#7b5800]/20",
  New:      "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Seasonal: "bg-sky-50 text-sky-700 border border-sky-200",
  Heritage: "bg-[#271908]/8 text-[#271908] border border-[#271908]/15",
};

// ─── Single menu item card ─────────────────────────────────────────────────
function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div className="group relative flex flex-col justify-between bg-white rounded-2xl p-5 luxury-shadow border border-[#e8d5bc]/40 hover:border-[#c8a97a]/60 hover:-translate-y-0.5 transition-all duration-300">
      {/* Badge */}
      {item.badge && (
        <span
          className={`absolute top-4 right-4 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full ${
            BADGE_STYLES[item.badge] ?? "bg-[#7b5800]/10 text-[#7b5800]"
          }`}
        >
          {item.badge}
        </span>
      )}

      <div className="space-y-1.5 pr-12">
        <h3 className="font-[family-name:var(--font-plus-jakarta)] text-[15px] font-semibold text-[#271908] leading-snug">
          {item.name}
        </h3>
        {item.description && (
          <p className="text-[#4f4541] text-xs leading-relaxed line-clamp-2">
            {item.description}
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-[family-name:var(--font-plus-jakarta)] text-base font-bold text-[#7b5800]">
          {item.price}
        </span>
        <button
          aria-label={`Add ${item.name} to order`}
          className="w-8 h-8 rounded-full bg-[#7b5800] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-[#5d4200] hover:scale-110 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px] select-none">add</span>
        </button>
      </div>
    </div>
  );
}

// ─── One full section block ────────────────────────────────────────────────
function MenuSectionBlock({ section }: { section: MenuSection }) {
  return (
    <section id={section.id} className="scroll-mt-36">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6 md:mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#271908] flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-[#c8a97a] text-[20px] select-none">
            {section.icon}
          </span>
        </div>
        <div>
          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-xl md:text-2xl font-bold text-[#271908]">
            {section.title}
          </h2>
          <div className="h-0.5 w-12 bg-[#7b5800] mt-1 rounded-full" />
        </div>
      </div>

      {/* Items grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {section.items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

// ─── Sticky section navigation ────────────────────────────────────────────
function StickyNav({
  sections,
  activeId,
}: {
  sections: MenuSection[];
  activeId: string;
}) {
  const navRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the nav pill into view when active section changes
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const activePill = nav.querySelector(`[data-id="${activeId}"]`) as HTMLElement | null;
    if (activePill) {
      activePill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }, [activeId]);

  return (
    <div className="sticky top-[60px] z-40 bg-[#fff8f4]/90 backdrop-blur-md border-b border-[#e8d5bc]/50 shadow-sm">
      <div
        ref={navRef}
        className="flex gap-2 overflow-x-auto no-scrollbar px-5 md:px-16 py-3 max-w-[1280px] mx-auto"
      >
        {sections.map((s) => (
          <a
            key={s.id}
            data-id={s.id}
            href={`#${s.id}`}
            className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-200 ${
              activeId === s.id
                ? "bg-[#271908] text-[#c8a97a] shadow-sm"
                : "bg-transparent text-[#4f4541] hover:bg-[#ffead8] hover:text-[#271908]"
            }`}
          >
            <span className="material-symbols-outlined text-[14px] select-none">{s.icon}</span>
            {s.title}
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Main client component ─────────────────────────────────────────────────
export default function MenuPageClient({ sections }: { sections: MenuSection[] }) {
  const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? "");

  // Intersection Observer — track which section is in the viewport
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
        { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sections]);

  return (
    <div className="min-h-screen bg-[#fff8f4]">
      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <div className="relative bg-[#271908] py-16 md:py-24 px-5 md:px-16 overflow-hidden">
        {/* Decorative pattern overlay */}
        <div className="pattern-overlay absolute inset-0 opacity-20" />

        {/* Decorative corner accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-[#c8a97a]/30 hidden md:block" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-[#c8a97a]/30 hidden md:block" />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <p className="text-[#c8a97a] text-xs font-semibold uppercase tracking-[0.25em] mb-3">
            Hamid Afandi
          </p>
          <h1 className="font-[family-name:var(--font-plus-jakarta)] text-3xl md:text-5xl font-bold text-white mb-4">
            Our Menu
          </h1>
          <p className="text-white/60 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Fresh ingredients, heritage recipes, and modern craft — explore
            everything we serve.
          </p>

          {/* Section count badge */}
          <div className="mt-6 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 rounded-full px-5 py-2">
            <span className="material-symbols-outlined text-[#c8a97a] text-[16px] select-none">
              restaurant_menu
            </span>
            <span className="text-white/80 text-xs font-semibold uppercase tracking-widest">
              {sections.length} Categories
            </span>
          </div>
        </div>
      </div>

      {/* ── Sticky Section Nav ───────────────────────────────────────────── */}
      <StickyNav sections={sections} activeId={activeId} />

      {/* ── Menu Content ────────────────────────────────────────────────── */}
      <div className="max-w-[1280px] mx-auto px-5 md:px-16 py-12 md:py-16 space-y-16 md:space-y-20">
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
        <p className="text-white/60 text-sm max-w-sm mx-auto mb-6">
          Come experience the aromas, the warmth, and the heritage — in our
          Mansoura branch.
        </p>
        <a
          href="/branches"
          className="inline-flex items-center gap-2 bg-[#7b5800] text-white px-8 py-3 rounded-full text-xs font-semibold uppercase tracking-widest hover:bg-[#5d4200] transition-colors"
        >
          <span className="material-symbols-outlined text-[16px] select-none">location_on</span>
          Find Our Branch
        </a>
      </div>
    </div>
  );
}
