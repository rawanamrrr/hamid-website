"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { SUPPORTED_LOCALES, type Locale } from "@hamid/core";
import { LOCALE_COOKIE } from "./constants";

export async function setLocaleAction(locale: string): Promise<void> {
  if (!SUPPORTED_LOCALES.includes(locale as Locale)) return;
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}
