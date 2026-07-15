"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import {
  db,
  storeCategories,
  storeCategoryTranslations,
  storeProducts,
  storeProductTranslations,
  storeProductMedia,
} from "@hamid/db";
import {
  storeCategorySchema,
  storeProductSchema,
  type StoreCategoryInput,
  type StoreProductInput,
} from "@hamid/core";
import { guardPermission, type ActionResult } from "@/lib/auth/rbac";

function revalidateStore() {
  revalidatePath("/admin/store");
  revalidatePath("/admin/store/products");
  revalidatePath("/store");
}

// ── Categories ────────────────────────────────────────────────────────────

export async function createStoreCategoryAction(input: StoreCategoryInput): Promise<ActionResult<{ id: number }>> {
  const guard = await guardPermission("store.manage");
  if ("error" in guard) return guard;

  const parsed = storeCategorySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  const data = parsed.data;

  const [existing] = await db.select({ id: storeCategories.id }).from(storeCategories).where(eq(storeCategories.slug, data.slug)).limit(1);
  if (existing) return { error: "A category with this slug already exists." };

  const id = await db.transaction(async (tx) => {
    const [row] = await tx
      .insert(storeCategories)
      .values({ slug: data.slug, imageMediaId: data.imageMediaId ?? null, sortOrder: data.sortOrder, isActive: data.isActive })
      .$returningId();
    await tx.insert(storeCategoryTranslations).values([
      { categoryId: row.id, locale: "en", name: data.name.en, description: data.description?.en || null },
      ...(data.name.ar ? [{ categoryId: row.id, locale: "ar" as const, name: data.name.ar, description: data.description?.ar || null }] : []),
    ]);
    return row.id;
  });

  revalidateStore();
  return { success: true, data: { id } };
}

export async function updateStoreCategoryAction(id: number, input: StoreCategoryInput): Promise<ActionResult> {
  const guard = await guardPermission("store.manage");
  if ("error" in guard) return guard;

  const parsed = storeCategorySchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  const data = parsed.data;

  await db.transaction(async (tx) => {
    await tx
      .update(storeCategories)
      .set({ slug: data.slug, imageMediaId: data.imageMediaId ?? null, sortOrder: data.sortOrder, isActive: data.isActive })
      .where(eq(storeCategories.id, id));

    await tx.delete(storeCategoryTranslations).where(eq(storeCategoryTranslations.categoryId, id));
    await tx.insert(storeCategoryTranslations).values([
      { categoryId: id, locale: "en", name: data.name.en, description: data.description?.en || null },
      ...(data.name.ar ? [{ categoryId: id, locale: "ar" as const, name: data.name.ar, description: data.description?.ar || null }] : []),
    ]);
  });

  revalidateStore();
  return { success: true };
}

export async function deleteStoreCategoryAction(id: number): Promise<ActionResult> {
  const guard = await guardPermission("store.manage");
  if ("error" in guard) return guard;

  const [productInCategory] = await db.select({ id: storeProducts.id }).from(storeProducts).where(eq(storeProducts.categoryId, id)).limit(1);
  if (productInCategory) return { error: "Move or delete this category's products before deleting it." };

  await db.delete(storeCategories).where(eq(storeCategories.id, id));
  revalidateStore();
  return { success: true };
}

// ── Products ──────────────────────────────────────────────────────────────

export async function createStoreProductAction(input: StoreProductInput): Promise<ActionResult<{ id: number }>> {
  const guard = await guardPermission("store.manage");
  if ("error" in guard) return guard;

  const parsed = storeProductSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  const data = parsed.data;

  const [existing] = await db.select({ id: storeProducts.id }).from(storeProducts).where(eq(storeProducts.slug, data.slug)).limit(1);
  if (existing) return { error: "A product with this slug already exists." };

  const id = await db.transaction(async (tx) => {
    const [row] = await tx
      .insert(storeProducts)
      .values({
        categoryId: data.categoryId,
        slug: data.slug,
        sku: data.sku || null,
        price: data.price,
        compareAtPrice: data.compareAtPrice ?? null,
        isBestSeller: data.isBestSeller,
        isFeaturedHome: data.isFeaturedHome,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
        stockQty: data.stockQty,
      })
      .$returningId();
    await tx.insert(storeProductTranslations).values([
      { productId: row.id, locale: "en", name: data.name.en, description: data.description?.en || null, notes: data.notes?.en || null },
      ...(data.name.ar
        ? [{ productId: row.id, locale: "ar" as const, name: data.name.ar, description: data.description?.ar || null, notes: data.notes?.ar || null }]
        : []),
    ]);
    if (data.mediaIds.length > 0) {
      await tx.insert(storeProductMedia).values(
        data.mediaIds.map((mediaId, i) => ({ productId: row.id, mediaId, sortOrder: i, isPrimary: i === 0 })),
      );
    }
    return row.id;
  });

  revalidateStore();
  return { success: true, data: { id } };
}

export async function updateStoreProductAction(id: number, input: StoreProductInput): Promise<ActionResult> {
  const guard = await guardPermission("store.manage");
  if ("error" in guard) return guard;

  const parsed = storeProductSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  const data = parsed.data;

  await db.transaction(async (tx) => {
    await tx
      .update(storeProducts)
      .set({
        categoryId: data.categoryId,
        slug: data.slug,
        sku: data.sku || null,
        price: data.price,
        compareAtPrice: data.compareAtPrice ?? null,
        isBestSeller: data.isBestSeller,
        isFeaturedHome: data.isFeaturedHome,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
        stockQty: data.stockQty,
      })
      .where(eq(storeProducts.id, id));

    await tx.delete(storeProductTranslations).where(eq(storeProductTranslations.productId, id));
    await tx.insert(storeProductTranslations).values([
      { productId: id, locale: "en", name: data.name.en, description: data.description?.en || null, notes: data.notes?.en || null },
      ...(data.name.ar
        ? [{ productId: id, locale: "ar" as const, name: data.name.ar, description: data.description?.ar || null, notes: data.notes?.ar || null }]
        : []),
    ]);

    await tx.delete(storeProductMedia).where(eq(storeProductMedia.productId, id));
    if (data.mediaIds.length > 0) {
      await tx.insert(storeProductMedia).values(
        data.mediaIds.map((mediaId, i) => ({ productId: id, mediaId, sortOrder: i, isPrimary: i === 0 })),
      );
    }
  });

  revalidateStore();
  return { success: true };
}

export async function deleteStoreProductAction(id: number): Promise<ActionResult> {
  const guard = await guardPermission("store.manage");
  if ("error" in guard) return guard;

  await db.delete(storeProducts).where(eq(storeProducts.id, id));
  revalidateStore();
  return { success: true };
}
