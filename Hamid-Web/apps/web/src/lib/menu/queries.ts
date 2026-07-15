import "server-only";
import { unstable_cache } from "next/cache";
import { asc, eq, inArray } from "drizzle-orm";
import { db, menuCategories, menuCategoryTranslations, menuItems, menuItemTranslations, menuHeroImages, media } from "@hamid/db";
import { formatMoney, toCents, type Locale } from "@hamid/core";

// See store/queries.ts for why this is time-based only (60s) rather than
// tag-based — same remote-DB rationale, same Next 16 revalidateTag caveat.
const CATALOG_REVALIDATE_SECONDS = 60;

export interface MenuItemView {
  id: string;
  name: string;
  description?: string;
  price: string;
  badge?: string;
}

export interface MenuSectionView {
  id: string;
  title: string;
  icon: string;
  items: MenuItemView[];
}

function pickTranslation<T extends { locale: string }>(rows: T[], locale: Locale): T | undefined {
  return rows.find((r) => r.locale === locale) ?? rows.find((r) => r.locale === "en");
}

async function getMenuSectionsImpl(locale: Locale = "en"): Promise<MenuSectionView[]> {
  const categories = await db
    .select()
    .from(menuCategories)
    .where(eq(menuCategories.isActive, true))
    .orderBy(asc(menuCategories.sortOrder));
  if (categories.length === 0) return [];

  const categoryIds = categories.map((c) => c.id);
  const [catTranslations, items] = await Promise.all([
    db.select().from(menuCategoryTranslations).where(inArray(menuCategoryTranslations.categoryId, categoryIds)),
    db.select().from(menuItems).where(inArray(menuItems.categoryId, categoryIds)),
  ]);

  const activeItems = items.filter((i) => i.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const itemIds = activeItems.map((i) => i.id);
  const itemTranslations = itemIds.length
    ? await db.select().from(menuItemTranslations).where(inArray(menuItemTranslations.itemId, itemIds))
    : [];

  return categories.map((cat) => {
    const t = pickTranslation(
      catTranslations.filter((r) => r.categoryId === cat.id),
      locale,
    );
    const catItems = activeItems.filter((i) => i.categoryId === cat.id);

    return {
      id: cat.slug,
      title: t?.name ?? cat.slug,
      icon: cat.icon ?? "coffee",
      items: catItems.map((item) => {
        const it = pickTranslation(
          itemTranslations.filter((r) => r.itemId === item.id),
          locale,
        );
        return {
          id: item.slug,
          name: it?.name ?? item.slug,
          description: it?.description ?? undefined,
          price: formatMoney(toCents(item.price), item.currency, locale),
          badge: item.badge ?? undefined,
        };
      }),
    };
  });
}

export const getMenuSections = unstable_cache(getMenuSectionsImpl, ["menu-sections"], {
  revalidate: CATALOG_REVALIDATE_SECONDS,
});

async function getMenuHeroImagesImpl(): Promise<string[]> {
  const rows = await db
    .select({ url: media.url })
    .from(menuHeroImages)
    .innerJoin(media, eq(media.id, menuHeroImages.mediaId))
    .where(eq(menuHeroImages.isActive, true))
    .orderBy(asc(menuHeroImages.sortOrder));
  return rows.map((r) => r.url);
}

export const getMenuHeroImages = unstable_cache(getMenuHeroImagesImpl, ["menu-hero-images"], {
  revalidate: CATALOG_REVALIDATE_SECONDS,
});
