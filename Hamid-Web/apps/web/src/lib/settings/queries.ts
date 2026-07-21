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
