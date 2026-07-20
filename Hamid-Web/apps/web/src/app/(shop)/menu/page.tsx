import type { Metadata } from "next";
import { getMenuSections } from "@/lib/menu/queries";
import { getDict, getLocale } from "@/lib/i18n";
import MenuPageClient from "./MenuPageClient";
import { LoadErrorBand } from "@/components/LoadErrorBand";
import { withDbTimeout } from "@/lib/db-timeout";

export const metadata: Metadata = {
  title: "Menu | Hamid Afandi",
  description:
    "Explore the full Hamid Afandi café menu — coffee, hot drinks, fresh juices, cocktails, milkshakes, smoothies, soft drinks, and desserts.",
};

// Note: this route reads the locale cookie (via getLocale), which forces
// dynamic (per-request) rendering — an ISR `revalidate` export here would be
// a no-op, so it's intentionally omitted. See docs/SETUP.md caching notes.

export default async function MenuPage() {
  const locale = await getLocale();
  const sections = await withDbTimeout(getMenuSections(locale)).catch(() => null);
  if (sections === null) {
    const dict = await getDict();
    return <LoadErrorBand message={dict.common.loadError} retryLabel={dict.common.retry} href="/menu" />;
  }
  return <MenuPageClient sections={sections} />;
}
