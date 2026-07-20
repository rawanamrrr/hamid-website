"use server";

import { revalidatePath } from "next/cache";
import { db, settings } from "@hamid/db";
import { guardPermission, type ActionResult } from "@/lib/auth/rbac";
import { logActivity } from "@/lib/activity/log";

export interface SiteSettingsInput {
  siteNameEn: string;
  siteNameAr: string;
  currency: string;
  deliveryFee: string;
  taxEnabled: boolean;
  guestCheckoutEnabled: boolean;
}

async function upsertSetting(group: string, key: string, value: unknown) {
  await db
    .insert(settings)
    .values({ group, key, value })
    .onDuplicateKeyUpdate({ set: { value } });
}

export async function updateSiteSettingsAction(input: SiteSettingsInput): Promise<ActionResult> {
  const guard = await guardPermission("settings.manage");
  if ("error" in guard) return guard;

  await Promise.all([
    upsertSetting("site", "name", { en: input.siteNameEn, ar: input.siteNameAr }),
    upsertSetting("site", "currency", input.currency),
    upsertSetting("checkout", "delivery_fee", input.deliveryFee),
    upsertSetting("checkout", "tax_enabled", input.taxEnabled),
    upsertSetting("checkout", "guest_checkout_enabled", input.guestCheckoutEnabled),
  ]);

  await logActivity({ actorUserId: Number(guard.id), action: "settings.updated", entityType: "settings" });
  revalidatePath("/admin/settings");
  return { success: true };
}
