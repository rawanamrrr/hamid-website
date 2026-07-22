import "server-only";
import { unstable_cache } from "next/cache";
import { and, asc, eq } from "drizzle-orm";
import { db, banners, bannerTranslations, media } from "@hamid/db";
import type { Locale } from "@hamid/core";
import { withDbTimeout } from "@/lib/db-timeout";

// Same time-based-only rationale as the catalog queries (store/queries.ts) —
// banners/hero slides were previously uncached, meaning the homepage's Hero
// and PromoBanner sections each paid for a fresh remote DB round-trip on
// every single load.
const CONTENT_REVALIDATE_SECONDS = 60;

export interface HeroSlideView {
  id: number;
  imageUrl: string;
  linkUrl: string | null;
  /** Optional per-slide overrides — the dictionary copy is used when absent. */
  title: string | null;
  subtitle: string | null;
  ctaText: string | null;
}

/**
 * Active hero slides for the homepage, managed from Admin → Home Page as
 * banners with the "home_hero" placement. Slide count is simply how many
 * active slides exist: 0 → built-in fallback, 1 → static hero, 2+ → slider.
 */
async function getHomeHeroSlidesImpl(locale: Locale): Promise<HeroSlideView[]> {
  const rows = await withDbTimeout(db
    .select({
      id: banners.id,
      imageUrl: media.url,
      linkUrl: banners.linkUrl,
      title: bannerTranslations.title,
      subtitle: bannerTranslations.subtitle,
      ctaText: bannerTranslations.ctaText,
    })
    .from(banners)
    .innerJoin(media, eq(media.id, banners.mediaId))
    .leftJoin(bannerTranslations, and(eq(bannerTranslations.bannerId, banners.id), eq(bannerTranslations.locale, locale)))
    .where(and(eq(banners.isActive, true), eq(banners.placement, "home_hero")))
    .orderBy(asc(banners.sortOrder)))
    // The hero must never take the homepage down with it — fall back to the
    // built-in slide on a transient DB failure or hang.
    .catch(() => []);

  return rows;
}
export const getHomeHeroSlides = unstable_cache(getHomeHeroSlidesImpl, ["home-hero-slides"], {
  revalidate: CONTENT_REVALIDATE_SECONDS,
});

export interface PromoBannerView {
  url: string;
  linkUrl: string | null;
  title: string | null;
}

async function getPromoBannerImpl(placement: string, locale: Locale): Promise<PromoBannerView | null> {
  const rows = await withDbTimeout(db
    .select({ url: media.url, linkUrl: banners.linkUrl, title: bannerTranslations.title })
    .from(banners)
    .innerJoin(media, eq(media.id, banners.mediaId))
    .leftJoin(bannerTranslations, and(eq(bannerTranslations.bannerId, banners.id), eq(bannerTranslations.locale, locale)))
    .where(and(eq(banners.isActive, true), eq(banners.placement, placement)))
    .orderBy(asc(banners.sortOrder))
    .limit(1))
    // Decorative — skip rather than crash the page on a transient DB failure or hang.
    .catch(() => []);

  return rows[0] ?? null;
}
export const getPromoBanner = unstable_cache(getPromoBannerImpl, ["promo-banner"], {
  revalidate: CONTENT_REVALIDATE_SECONDS,
});
