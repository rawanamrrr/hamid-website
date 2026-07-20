import "server-only";
import { and, asc, eq } from "drizzle-orm";
import { db, banners, bannerTranslations, media } from "@hamid/db";
import type { Locale } from "@hamid/core";
import { withDbTimeout } from "@/lib/db-timeout";

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
export async function getHomeHeroSlides(locale: Locale): Promise<HeroSlideView[]> {
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
