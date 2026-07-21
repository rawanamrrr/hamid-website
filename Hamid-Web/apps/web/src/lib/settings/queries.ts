import "server-only";
import { and, eq } from "drizzle-orm";
import { db, settings } from "@hamid/db";
import type { GovernorateFee } from "./actions";

async function getSetting(group: string, key: string): Promise<unknown> {
  const [row] = await db
    .select({ value: settings.value })
    .from(settings)
    .where(and(eq(settings.group, group), eq(settings.key, key)))
    .limit(1);
  return row?.value;
}

/** Per-governorate delivery fees configured in Admin → Settings (may be empty). */
export async function getGovernorateFees(): Promise<GovernorateFee[]> {
  const value = await getSetting("checkout", "governorate_fees").catch(() => null);
  if (!Array.isArray(value)) return [];
  return value.filter(
    (g): g is GovernorateFee => typeof g === "object" && g !== null && typeof g.name === "string" && typeof g.fee === "string",
  );
}

/** Where contact-form messages and admin alerts (new orders, etc.) are sent. */
export async function getNotificationEmail(): Promise<string> {
  const value = await getSetting("notifications", "email").catch(() => null);
  return typeof value === "string" && value.trim() ? value.trim() : "zeyad5zoks@gmail.com";
}

const DEFAULT_SITE_NAME = { en: "Hamid Afandi", ar: "حامد أفندي" };

/** Site name configured in Admin → Settings → General. */
export async function getSiteName(): Promise<{ en: string; ar: string }> {
  const value = (await getSetting("site", "name").catch(() => null)) as { en?: string; ar?: string } | null;
  return {
    en: value?.en?.trim() || DEFAULT_SITE_NAME.en,
    ar: value?.ar?.trim() || DEFAULT_SITE_NAME.ar,
  };
}

/** Default currency configured in Admin → Settings → General — used for new store products. */
export async function getSiteCurrency(): Promise<string> {
  const value = await getSetting("site", "currency").catch(() => null);
  return typeof value === "string" && value.trim() ? value.trim().toUpperCase() : "EGP";
}

/** Whether guests may check out without an account (Admin → Settings → General). */
export async function isGuestCheckoutEnabled(): Promise<boolean> {
  const value = await getSetting("checkout", "guest_checkout_enabled").catch(() => null);
  return value !== false;
}

/** InstaPay account to display at checkout so customers know where to send the payment. */
export async function getInstapayDetails(): Promise<{ number: string; name: string }> {
  const [number, name] = await Promise.all([
    getSetting("checkout", "instapay_number").catch(() => null),
    getSetting("checkout", "instapay_name").catch(() => null),
  ]);
  return {
    number: typeof number === "string" ? number.trim() : "",
    name: typeof name === "string" ? name.trim() : "",
  };
}
