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
  ctaTextEn?: string;
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
    if (input.titleAr) {
      await tx.insert(bannerTranslations).values({ bannerId: row.id, locale: "ar", title: input.titleAr });
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
