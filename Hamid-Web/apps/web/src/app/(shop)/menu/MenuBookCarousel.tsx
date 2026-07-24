"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import type { MenuSectionView as MenuSection, MenuItemView as MenuItem } from "@/lib/menu/queries";

const BADGE_STYLES: Record<string, string> = {
  Popular:  "bg-[#c8a97a]/20 text-[#e9cd9c] border border-[#c8a97a]/30",
  New:      "bg-emerald-500/15 text-emerald-300 border border-emerald-400/30",
  Seasonal: "bg-sky-500/15 text-sky-300 border border-sky-400/30",
  Heritage: "bg-white/10 text-white/80 border border-white/20",
};

type FlipDir = "next" | "prev";

const MAX_ROTATION = 130; // degrees
const COMMIT_THRESHOLD = MAX_ROTATION * 0.4;
const SETTLE_MS = 340;
const DRAG_DEAD_ZONE_PX = 8;

/** How many items fit on one page without scrolling, per breakpoint — tuned to each size's fixed card height (see the `h-[...]` classes below) so a category with more items than this spills onto extra pages instead of getting a scrollbar. */
function useItemsPerPage(): number {
  const [n, setN] = useState(6);
  useEffect(() => {
    const mqSm = window.matchMedia("(min-width: 640px)");
    const mqLg = window.matchMedia("(min-width: 1024px)");
    // md's taller header leaves roughly the same item-list height as sm's,
    // so both share a cap — the earlier 8-for-md estimate ran taller than
    // real rows (badges + description push a row past ~75px) and overflowed.
    // lg gets a genuinely taller card (see the h-[...] classes below), so it
    // can safely fit more.
    const compute = () => setN(mqLg.matches ? 8 : mqSm.matches ? 6 : 3);
    compute();
    mqSm.addEventListener("change", compute);
    mqLg.addEventListener("change", compute);
    return () => {
      mqSm.removeEventListener("change", compute);
      mqLg.removeEventListener("change", compute);
    };
  }, []);
  return n;
}

interface BookPage {
  section: MenuSection;
  items: MenuItem[];
  pageInSection: number;
  totalPagesInSection: number;
}

function buildPages(sections: MenuSection[], itemsPerPage: number): BookPage[] {
  const pages: BookPage[] = [];
  for (const section of sections) {
    const chunks: MenuItem[][] = [];
    for (let i = 0; i < section.items.length; i += itemsPerPage) {
      chunks.push(section.items.slice(i, i + itemsPerPage));
    }
    if (chunks.length === 0) chunks.push([]);
    chunks.forEach((items, i) =>
      pages.push({ section, items, pageInSection: i + 1, totalPagesInSection: chunks.length }),
    );
  }
  return pages;
}

/** Short synthesized paper "whoosh" — no external audio asset needed, and it's silently skipped if Web Audio is unavailable/blocked. */
function playPageFlipSound() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const durationSec = 0.22;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * durationSec, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      const decay = 1 - i / data.length;
      data[i] = (Math.random() * 2 - 1) * decay * decay;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 2400;
    bandpass.Q.value = 0.6;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);
    noise.connect(bandpass).connect(gain).connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + durationSec);
    noise.onended = () => {
      if (ctx.state !== "closed") ctx.close().catch(() => {});
    };
  } catch {
    // Web Audio unsupported/blocked — the visual flip still works fine without it.
  }
}

function BookItemRow({ item }: { item: MenuItem }) {
  const singleSize = item.sizes.length === 1;
  return (
    <div className="border-b border-white/10 py-2 first:pt-0 last:border-b-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {item.badge && (
            <span
              className={`mb-0.5 inline-block rounded-full px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest ${
                BADGE_STYLES[item.badge] ?? "bg-white/10 text-white/70"
              }`}
            >
              {item.badge}
            </span>
          )}
          <h4 className="font-[family-name:var(--font-plus-jakarta)] text-sm font-semibold text-white">
            {item.name}
          </h4>
          {item.description && (
            <p className="mt-0.5 line-clamp-1 text-xs leading-relaxed text-white/50">{item.description}</p>
          )}
        </div>
        {singleSize ? (
          <span className="shrink-0 font-[family-name:var(--font-plus-jakarta)] text-sm font-bold text-[#e9cd9c]">
            {item.sizes[0].price}
          </span>
        ) : (
          <div className="w-24 shrink-0 space-y-0.5">
            {item.sizes.map((s) => (
              <div key={s.size} className="flex items-baseline justify-between gap-2 text-xs">
                <span className="truncate text-white/40">{s.size}</span>
                <span className="whitespace-nowrap font-semibold text-[#e9cd9c]">{s.price}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * One book page. Every page of a category — including continuation pages,
 * when a category has more items than fit on one page — uses the exact same
 * full photo banner and title treatment, just with a "(2/3)"-style counter
 * appended to the title on continuation pages.
 */
function PageSpread({ page }: { page: BookPage }) {
  const { section, items, pageInSection, totalPagesInSection } = page;
  const isContinuation = pageInSection > 1;

  return (
    <div className="flex h-full flex-col bg-[#140d08]">
      <div className="relative h-[220px] shrink-0 sm:h-[260px] md:h-[300px] lg:h-[360px]">
        {section.image ? (
          <Image src={section.image} alt="" fill unoptimized sizes="(max-width: 768px) 100vw, 1280px" className="object-cover" priority={false} />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#3a2614] to-[#1a1006]">
            <span aria-hidden="true" className="material-symbols-outlined text-7xl text-[#c8a97a]/60">
              {section.icon}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#140d08] via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5 md:px-10 md:py-6 lg:px-12 lg:py-8">
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c8a97a] sm:text-[11px] sm:tracking-[0.25em]">
            Hamid Afandi
          </p>
          <h2 className="font-[family-name:var(--font-plus-jakarta)] text-2xl font-bold text-white sm:text-3xl md:text-5xl lg:text-6xl">
            {section.title}
            {isContinuation && (
              <span className="ms-2 text-sm font-normal text-white/50">
                ({pageInSection}/{totalPagesInSection})
              </span>
            )}
          </h2>
        </div>
      </div>
      <div className="flex-1 overflow-hidden p-3 sm:p-5 md:px-10 md:py-6 lg:px-12 lg:py-8">
        <div className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-10">
          {items.map((item) => (
            <BookItemRow key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface FlipState {
  from: number;
  to: number;
  dir: FlipDir;
  rotation: number; // 0..MAX_ROTATION, magnitude only — sign comes from dir
  settling: boolean; // true = CSS-eased (button flip or drag release), false = tracking the pointer 1:1
}

/**
 * Book-style menu carousel — one page per flip, turned via a real hand-drag
 * page-flip (pointer events power a live rotateY that follows the
 * finger/cursor, with a short synthesized paper sound on commit) as well as
 * the prev/next buttons for click/keyboard use. Categories with more items
 * than fit on a single page (see useItemsPerPage) spill onto extra pages
 * instead of scrolling internally — a book page doesn't scroll, it turns.
 */
export function MenuBookCarousel({ sections }: { sections: MenuSection[] }) {
  const itemsPerPage = useItemsPerPage();
  const pages = useMemo(() => buildPages(sections, itemsPerPage), [sections, itemsPerPage]);

  const [index, setIndex] = useState(0);
  const [flip, setFlip] = useState<FlipState | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef<number | null>(null);
  const pillStripRef = useRef<HTMLDivElement>(null);

  // Item counts (and so page counts) can change when itemsPerPage recomputes
  // on a breakpoint change — clamp so a stale index never points past the
  // end of the newly-rebuilt pages array.
  const safeIndex = Math.min(index, pages.length - 1);
  const activeSectionId = pages[safeIndex]?.section.id;

  // Keep the category pill strip following along as pages turn — via drag,
  // the arrow buttons, or a pill click alike — not just reacting to clicks
  // on the strip itself.
  useEffect(() => {
    const strip = pillStripRef.current;
    if (!strip || !activeSectionId) return;
    const activePill = strip.querySelector(`[data-section="${activeSectionId}"]`) as HTMLElement | null;
    if (!activePill) return;
    const targetLeft = activePill.offsetLeft - strip.clientWidth / 2 + activePill.clientWidth / 2;
    strip.scrollTo({ left: targetLeft, behavior: "smooth" });
  }, [activeSectionId]);

  if (pages.length === 0) return null;
  const wrap = (i: number) => (i + pages.length) % pages.length;

  const startButtonFlip = (dir: FlipDir) => {
    if (flip) return;
    const to = wrap(dir === "next" ? safeIndex + 1 : safeIndex - 1);
    playPageFlipSound();
    setFlip({ from: safeIndex, to, dir, rotation: 0, settling: true });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setFlip((f) => (f ? { ...f, rotation: MAX_ROTATION } : f)));
    });
    window.setTimeout(() => {
      setIndex(to);
      setFlip(null);
    }, SETTLE_MS + 180);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (flip) return;
    dragStartX.current = e.clientX;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const deltaX = e.clientX - dragStartX.current;
    const width = containerRef.current?.clientWidth || 1;

    if (!flip) {
      if (Math.abs(deltaX) < DRAG_DEAD_ZONE_PX) return;
      const dir: FlipDir = deltaX < 0 ? "next" : "prev";
      const to = wrap(dir === "next" ? safeIndex + 1 : safeIndex - 1);
      setFlip({ from: safeIndex, to, dir, rotation: 0, settling: false });
      return;
    }
    if (flip.settling) return;
    const progress = Math.min(1, Math.abs(deltaX) / (width * 0.65));
    setFlip((f) => (f ? { ...f, rotation: progress * MAX_ROTATION } : f));
  };

  const finishDrag = () => {
    if (dragStartX.current === null) return;
    dragStartX.current = null;
    if (!flip || flip.settling) return;

    const commit = flip.rotation >= COMMIT_THRESHOLD;
    const target = flip.to;
    if (commit) playPageFlipSound();
    setFlip((f) => (f ? { ...f, rotation: commit ? MAX_ROTATION : 0, settling: true } : f));
    window.setTimeout(() => {
      if (commit) setIndex(target);
      setFlip(null);
    }, SETTLE_MS);
  };

  const page = pages[safeIndex];
  const displayedBase = flip ? pages[flip.to] : page;

  // How far through the flip we are, 0→1, and a lift amount that peaks at
  // the midpoint (the page casts its strongest shadow/highlight when it's
  // standing straight up, not when it's flat at either end) — the same
  // curve a real turning page's lighting follows.
  const progress = flip ? flip.rotation / MAX_ROTATION : 0;
  const lift = Math.sin(progress * Math.PI);
  const spineSide = flip?.dir === "next" ? "left" : "right";

  // One dot per category (not per page) — jumps to that category's first page.
  const sectionStartIndex = new Map<string, number>();
  pages.forEach((p, i) => {
    if (p.pageInSection === 1) sectionStartIndex.set(p.section.id, i);
  });

  return (
    <div className="mx-auto max-w-[1280px] px-4 sm:px-8 py-8 md:px-16 md:py-14 lg:max-w-[1800px] lg:px-12 xl:px-16">
      {/* Category quick-select — jumps straight to a category's first page.
          A single horizontally-scrolling strip on mobile (wrapping into
          tall stacked rows ate too much vertical space there); wraps into a
          centered, roomier grid from sm up where width isn't as tight. */}
      <div
        ref={pillStripRef}
        className="mb-6 -mx-4 flex gap-2.5 overflow-x-auto px-4 pb-1 no-scrollbar sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0 md:mb-10 md:gap-4"
      >
        {sections.map((s) => {
          const pageIdx = sectionStartIndex.get(s.id) ?? 0;
          const active = page.section.id === s.id;
          return (
            <button
              key={s.id}
              type="button"
              data-section={s.id}
              onClick={() => !flip && setIndex(pageIdx)}
              className={`shrink-0 rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors sm:px-6 sm:py-3 sm:text-base md:px-8 md:py-4 md:text-lg lg:px-9 lg:text-xl ${
                active
                  ? "border-[#7b5800] bg-[#7b5800] text-white"
                  : "border-[#e8d5bc] bg-white text-[#271908] hover:border-[#7b5800]/50"
              }`}
            >
              {s.title}
            </button>
          );
        })}
      </div>

      <div className="relative">
        <div
          ref={containerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
          onPointerLeave={finishDrag}
          className="relative overflow-hidden rounded-[1.75rem] bg-white shadow-[0_20px_45px_-18px_rgba(39,25,8,0.35)] select-none"
          style={{ perspective: "2200px", touchAction: "pan-y" }}
        >
          {/* Base layer — the page underneath, fully hidden while rotation is 0 */}
          <div className="h-[490px] bg-[#0d0705] sm:h-[600px] md:h-[640px] lg:h-[760px]">
            <PageSpread page={displayedBase} />
          </div>

          {/* Shadow the lifting page casts onto the page underneath, near the spine it's pivoting from */}
          {flip && (
            <div
              className="pointer-events-none absolute inset-y-0 z-[5] w-1/3"
              style={{
                [spineSide]: 0,
                background: `linear-gradient(to ${spineSide === "left" ? "right" : "left"}, rgba(0,0,0,${0.5 * lift}), transparent)`,
              }}
            />
          )}

          {/* Outgoing page, rotating away around the spine to reveal the base layer */}
          {flip && (
            <div
              className="absolute inset-0 z-10 bg-[#0d0705]"
              style={{
                transform: `rotateY(${(flip.dir === "next" ? -1 : 1) * flip.rotation}deg)`,
                transformOrigin: flip.dir === "next" ? "left center" : "right center",
                transition: flip.settling ? `transform ${SETTLE_MS}ms cubic-bezier(0.45,0,0.2,1)` : "none",
                backfaceVisibility: "hidden",
                boxShadow: `0 0 ${50 * lift}px rgba(0,0,0,${0.6 * lift})`,
              }}
            >
              <PageSpread page={pages[flip.from]} />
              {/* Light catching the curling paper — brightest at the spine, fading toward the far edge */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `linear-gradient(to ${flip.dir === "next" ? "right" : "left"}, rgba(255,255,255,${0.22 * lift}), transparent 45%)`,
                }}
              />
            </div>
          )}
        </div>

        {/* Bare chevrons, no circle/background — vertically centered on the
            whole card, floating in the page's margin outside it rather than
            overlapping the card's own content. */}
        <button
          type="button"
          onClick={() => startButtonFlip("prev")}
          aria-label="Previous page"
          className="absolute -start-4 top-1/2 z-30 flex -translate-y-1/2 items-center justify-center text-[#271908] transition-transform hover:scale-110 sm:-start-8 md:-start-14"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-3xl sm:text-4xl md:text-5xl">
            chevron_left
          </span>
        </button>
        <button
          type="button"
          onClick={() => startButtonFlip("next")}
          aria-label="Next page"
          className="absolute -end-4 top-1/2 z-30 flex -translate-y-1/2 items-center justify-center text-[#271908] transition-transform hover:scale-110 sm:-end-8 md:-end-14"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-3xl sm:text-4xl md:text-5xl">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
}
