"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db, banners, bannerTranslations } from "@hamid/db";
import { guardPermission, type ActionResult } from "@/lib/auth/rbac";

export interface BannerInput {
  mediaId: number;
  linkUrl?: string;
  placement: string;
  titleEn?: string;
  titleAr?: string;
  subtitleEn?: string;
  subtitleAr?: string;
  ctaTextEn?: string;
  ctaTextAr?: string;
  isActive: boolean;
  sortOrder: number;
}

function revalidateContent() {
  revalidatePath("/admin/content");
  revalidatePath("/");
}

export async function createBannerAction(input: BannerInput): Promise<ActionResult<{ id: number }>> {
  const guard = await guardPermission("content.manage");
  if ("error" in guard) return guard;

  const id = await db.transaction(async (tx) => {
    const [row] = await tx
      .insert(banners)
      .values({
        mediaId: input.mediaId,
        linkUrl: input.linkUrl || null,
        placement: input.placement,
        isActive: input.isActive,
        sortOrder: input.sortOrder,
      })
      .$returningId();

    if (input.titleEn || input.subtitleEn || input.ctaTextEn) {
      await tx.insert(bannerTranslations).values({
        bannerId: row.id,
        locale: "en",
        title: input.titleEn || null,
        subtitle: input.subtitleEn || null,
        ctaText: input.ctaTextEn || null,
      });
    }
    if (input.titleAr || input.subtitleAr || input.ctaTextAr) {
      await tx.insert(bannerTranslations).values({
        bannerId: row.id,
        locale: "ar",
        title: input.titleAr || null,
        subtitle: input.subtitleAr || null,
        ctaText: input.ctaTextAr || null,
      });
    }
    return row.id;
  });

  revalidateContent();
  return { success: true, data: { id } };
}

export async function toggleBannerActiveAction(id: number, isActive: boolean): Promise<ActionResult> {
  const guard = await guardPermission("content.manage");
  if ("error" in guard) return guard;

  await db.update(banners).set({ isActive }).where(eq(banners.id, id));
  revalidateContent();
  return { success: true };
}

export async function deleteBannerAction(id: number): Promise<ActionResult> {
  const guard = await guardPermission("content.manage");
  if ("error" in guard) return guard;

  await db.delete(banners).where(eq(banners.id, id));
  revalidateContent();
  return { success: true };
}

/** Persist a new display order — index in the array becomes the sortOrder. */
export async function reorderBannersAction(orderedIds: number[]): Promise<ActionResult> {
  const guard = await guardPermission("content.manage");
  if ("error" in guard) return guard;

  await db.transaction(async (tx) => {
    for (let i = 0; i < orderedIds.length; i++) {
      await tx.update(banners).set({ sortOrder: i }).where(eq(banners.id, orderedIds[i]));
    }
  });
  revalidateContent();
  return { success: true };
}
