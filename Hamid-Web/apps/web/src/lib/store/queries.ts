import "server-only";
import { unstable_cache } from "next/cache";
import { and, asc, eq, inArray, isNull, like } from "drizzle-orm";
import {
  db,
  storeCategories,
  storeCategoryTranslations,
  storeProducts,
  storeProductTranslations,
  storeProductMedia,
  media,
} from "@hamid/db";
import { formatMoney, toCents, type Locale } from "@hamid/core";

/**
 * 60s time-based cache on the read-heavy public catalog queries — this is a
 * remote, shared MySQL host (see docs/SETUP.md), and every page load was
 * hitting it fresh. Deliberately NOT using unstable_cache's tag-based
 * invalidation here: Next 16 deprecated the single-arg revalidateTag() this
 * package predates, and the two-arg profile-based replacement's interop with
 * unstable_cache's own tag system isn't documented — silently-broken
 * invalidation (admin edits never appearing) is worse than 60s of staleness.
 * Store/menu admin actions already call revalidatePath for the page shell;
 * this only affects how fresh the underlying data fetch is within that window.
 */
const CATALOG_REVALIDATE_SECONDS = 60;

export interface StoreCategoryView {
  slug: string;
  name: string;
}

export interface StoreProductView {
  id: number;
  slug: string;
  name: string;
  price: string;
  compareAtPrice: string | null;
  /** null = product has no reviews yet — render an unrated state, don't fabricate a score. */
  rating: number | null;
  tag: string;
  badge?: string;
  image: string;
  alt: string;
  categorySlug: string;
  stockQty: number;
  isFeaturedHome: boolean;
  isBestSeller: boolean;
}

function pickTranslation<T extends { locale: string }>(rows: T[], locale: Locale): T | undefined {
  return rows.find((r) => r.locale === locale) ?? rows.find((r) => r.locale === "en");
}

async function getStoreCategoriesImpl(locale: Locale = "en"): Promise<StoreCategoryView[]> {
  const categoryRows = await db
    .select()
    .from(storeCategories)
    .where(eq(storeCategories.isActive, true))
    .orderBy(asc(storeCategories.sortOrder));
  if (categoryRows.length === 0) return [];

  const translations = await db
    .select()
    .from(storeCategoryTranslations)
    .where(inArray(storeCategoryTranslations.categoryId, categoryRows.map((c) => c.id)));

  return categoryRows.map((cat) => {
    const t = pickTranslation(translations.filter((x) => x.categoryId === cat.id), locale);
    return { slug: cat.slug, name: t?.name ?? cat.slug };
  });
}

export const getStoreCategories = unstable_cache(getStoreCategoriesImpl, ["store-categories"], {
  revalidate: CATALOG_REVALIDATE_SECONDS,
});

export interface StoreProductFilter {
  categorySlug?: string;
  /** Filter in SQL rather than fetching the whole catalog and filtering in JS — see getFeaturedHomeProducts/getBestSellerProducts. */
  onlyFeaturedHome?: boolean;
  onlyBestSeller?: boolean;
  limit?: number;
  /** Matches against product name/description translations (any locale). */
  search?: string;
}

async function getStoreProductsImpl(locale: Locale = "en", filter: string | StoreProductFilter = {}): Promise<StoreProductView[]> {
  // Back-compat: a bare string is still treated as categorySlug (existing callers pass a string).
  const { categorySlug, onlyFeaturedHome, onlyBestSeller, limit, search } = typeof filter === "string" ? { categorySlug: filter } as StoreProductFilter : filter;

  const categoryRows = await db.select().from(storeCategories).where(eq(storeCategories.isActive, true));
  const categoryBySlug = new Map(categoryRows.map((c) => [c.slug, c]));
  const categoryById = new Map(categoryRows.map((c) => [c.id, c]));

  let searchProductIds: number[] | null = null;
  if (search && search.trim()) {
    const matches = await db
      .selectDistinct({ productId: storeProductTranslations.productId })
      .from(storeProductTranslations)
      .where(like(storeProductTranslations.name, `%${search.trim()}%`));
    searchProductIds = matches.map((m) => m.productId);
    if (searchProductIds.length === 0) return [];
  }

  const categoryIds = categorySlug && categoryBySlug.has(categorySlug)
    ? [categoryBySlug.get(categorySlug)!.id]
    : categoryRows.map((c) => c.id);
  if (categoryIds.length === 0) return [];

  const conditions = [eq(storeProducts.isActive, true), isNull(storeProducts.deletedAt), inArray(storeProducts.categoryId, categoryIds)];
  if (onlyFeaturedHome) conditions.push(eq(storeProducts.isFeaturedHome, true));
  if (onlyBestSeller) conditions.push(eq(storeProducts.isBestSeller, true));
  if (searchProductIds) conditions.push(inArray(storeProducts.id, searchProductIds));

  let query = db
    .select()
    .from(storeProducts)
    .where(and(...conditions))
    .orderBy(asc(storeProducts.sortOrder))
    .$dynamic();
  if (limit) query = query.limit(limit);
  const products = await query;
  if (products.length === 0) return [];

  const productIds = products.map((p) => p.id);
  const [translations, mediaRows] = await Promise.all([
    db.select().from(storeProductTranslations).where(inArray(storeProductTranslations.productId, productIds)),
    db
      .select({ productId: storeProductMedia.productId, url: media.url, isPrimary: storeProductMedia.isPrimary })
      .from(storeProductMedia)
      .innerJoin(media, eq(media.id, storeProductMedia.mediaId))
      .where(inArray(storeProductMedia.productId, productIds)),
  ]);

  return products.map((p) => {
    const t = pickTranslation(translations.filter((x) => x.productId === p.id), locale);
    const primaryMedia = mediaRows.find((m) => m.productId === p.id && m.isPrimary) ?? mediaRows.find((m) => m.productId === p.id);
    const category = categoryById.get(p.categoryId);

    return {
      id: p.id,
      slug: p.slug,
      name: t?.name ?? p.slug,
      price: formatMoney(toCents(p.price), p.currency, locale),
      compareAtPrice: p.compareAtPrice ? formatMoney(toCents(p.compareAtPrice), p.currency, locale) : null,
      rating: p.rating ? Number(p.rating) : null,
      tag: category?.slug ?? "",
      badge: p.isBestSeller ? "Bestseller" : undefined,
      image: primaryMedia?.url ?? "",
      alt: t?.name ?? p.slug,
      categorySlug: category?.slug ?? "",
      stockQty: p.stockQty,
      isFeaturedHome: p.isFeaturedHome,
      isBestSeller: p.isBestSeller,
    };
  });
}

export const getStoreProducts = unstable_cache(getStoreProductsImpl, ["store-products"], {
  revalidate: CATALOG_REVALIDATE_SECONDS,
});

export interface StoreProductDetailView extends StoreProductView {
  description: string | null;
  notes: string | null;
  images: { url: string; alt: string }[];
}

async function getStoreProductBySlugImpl(slug: string, locale: Locale = "en"): Promise<StoreProductDetailView | null> {
  const [product] = await db
    .select()
    .from(storeProducts)
    .where(and(eq(storeProducts.slug, slug), eq(storeProducts.isActive, true), isNull(storeProducts.deletedAt)))
    .limit(1);
  if (!product) return null;

  const [category, translations, mediaRows] = await Promise.all([
    db.select().from(storeCategories).where(eq(storeCategories.id, product.categoryId)).limit(1).then((r) => r[0]),
    db.select().from(storeProductTranslations).where(eq(storeProductTranslations.productId, product.id)),
    db
      .select({ url: media.url, isPrimary: storeProductMedia.isPrimary, sortOrder: storeProductMedia.sortOrder })
      .from(storeProductMedia)
      .innerJoin(media, eq(media.id, storeProductMedia.mediaId))
      .where(eq(storeProductMedia.productId, product.id))
      .orderBy(asc(storeProductMedia.sortOrder)),
  ]);

  const t = pickTranslation(translations, locale);
  const primaryMedia = mediaRows.find((m) => m.isPrimary) ?? mediaRows[0];

  return {
    id: product.id,
    slug: product.slug,
    name: t?.name ?? product.slug,
    description: t?.description ?? null,
    notes: t?.notes ?? null,
    price: formatMoney(toCents(product.price), product.currency, locale),
    compareAtPrice: product.compareAtPrice ? formatMoney(toCents(product.compareAtPrice), product.currency, locale) : null,
    rating: product.rating ? Number(product.rating) : null,
    tag: category?.slug ?? "",
    badge: product.isBestSeller ? "Bestseller" : undefined,
    image: primaryMedia?.url ?? "",
    alt: t?.name ?? product.slug,
    images: mediaRows.map((m) => ({ url: m.url, alt: t?.name ?? product.slug })),
    categorySlug: category?.slug ?? "",
    stockQty: product.stockQty,
    isFeaturedHome: product.isFeaturedHome,
    isBestSeller: product.isBestSeller,
  };
}

export const getStoreProductBySlug = unstable_cache(getStoreProductBySlugImpl, ["store-product-by-slug"], {
  revalidate: CATALOG_REVALIDATE_SECONDS,
});

export async function getFeaturedHomeProducts(locale: Locale = "en", limit = 8): Promise<StoreProductView[]> {
  return getStoreProducts(locale, { onlyFeaturedHome: true, limit });
}

export async function getBestSellerProducts(locale: Locale = "en", limit = 8): Promise<StoreProductView[]> {
  return getStoreProducts(locale, { onlyBestSeller: true, limit });
}
