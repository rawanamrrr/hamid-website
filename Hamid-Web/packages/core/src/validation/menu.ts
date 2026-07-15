import { z } from "zod";
import { slugSchema, decimalString, requiredLocalizedText, optionalLocalizedText } from "./shared";

export const menuCategorySchema = z.object({
  slug: slugSchema,
  icon: z.string().max(100).optional(),
  imageMediaId: z.number().int().positive().nullable().optional(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
  name: requiredLocalizedText(191),
  description: optionalLocalizedText(500),
});
export type MenuCategoryInput = z.infer<typeof menuCategorySchema>;

export const menuItemSchema = z.object({
  categoryId: z.number().int().positive(),
  slug: slugSchema,
  price: decimalString,
  imageMediaId: z.number().int().positive().nullable().optional(),
  badge: z.string().max(50).optional(),
  isFeatured: z.boolean().default(false),
  isNew: z.boolean().default(false),
  isActive: z.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
  name: requiredLocalizedText(191),
  description: optionalLocalizedText(500),
  notes: optionalLocalizedText(255),
});
export type MenuItemInput = z.infer<typeof menuItemSchema>;

export const menuHeroImageSchema = z.object({
  mediaId: z.number().int().positive(),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.boolean().default(true),
});
export type MenuHeroImageInput = z.infer<typeof menuHeroImageSchema>;
