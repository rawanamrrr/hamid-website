"use server";

import { cookies } from "next/headers";
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
  // No revalidatePath here: getLocale() reads this cookie via cookies(),
  // which already makes every page dynamic (rendered fresh per request), and
  // LanguageSwitcher's router.refresh() is what re-fetches the current page
  // with the new cookie. A revalidatePath("/", "layout") call used to sit
  // here — but "layout" revalidates every route sharing the root layout,
  // i.e. the whole app, not just the current page. That's pure overhead on
  // every single language switch, and is what made switching feel like it
  // hung forever.
}
