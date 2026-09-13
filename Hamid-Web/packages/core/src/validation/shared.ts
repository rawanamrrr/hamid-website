import { z } from "zod";

export const SUPPORTED_LOCALES = ["en", "ar"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const slugSchema = z
  .string()
  .min(1)
  .max(150)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Lowercase letters, numbers and hyphens only");

/** Same shape as slugSchema, but blank/omitted is allowed — the caller is
 * expected to fill in an auto-generated slug (see slugify()) server-side
 * before persisting, since the column itself is still NOT NULL/unique. */
export const optionalSlugSchema = z.union([slugSchema, z.literal(""), z.undefined()]).optional();

/** Turns free text (typically an English name) into a slugSchema-valid slug:
 * lowercase, non-alphanumerics collapsed to single hyphens, no leading/
 * trailing hyphen. Used to auto-fill the slug field when an admin leaves it
 * blank when creating a product/menu item. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Form-friendly: accepts a number or numeric string, always outputs a 2dp decimal string for the DB. */
export const decimalString = z.coerce.number().min(0).transform((n) => n.toFixed(2));

/** Blank/null/undefined AND an explicit 0 all mean "no compare-at price" —
 * not "$0.00", which would render as a bogus struck-through before-price.
 * Normalizing to `null` happens in preprocess (before the union) because
 * z.coerce.number() on decimalString happily coerces "", null, and 0 itself
 * into 0 and would otherwise "win" the union over the null branch, which is
 * exactly the bug this schema exists to avoid. */
export const nullableDecimalString = z.preprocess((v) => {
  if (v === "" || v === null || v === undefined) return null;
  const num = typeof v === "number" ? v : Number(v);
  return Number.isFinite(num) && num === 0 ? null : v;
}, z.union([z.null(), decimalString]));

/** English required, Arabic optional — matches how content is authored: EN first, AR filled in when ready. */
export const requiredLocalizedText = (max: number) =>
  z.object({
    en: z.string().min(1, "English text is required").max(max),
    ar: z.string().max(max).optional().or(z.literal("")),
  });

export const optionalLocalizedText = (max: number) =>
  z.object({
    en: z.string().max(max).optional().or(z.literal("")),
    ar: z.string().max(max).optional().or(z.literal("")),
  });

export type LocalizedText = { en: string; ar?: string };
