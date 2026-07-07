import type { Metadata } from "next";
import type { MenuSection } from "@/lib/menuData";
import MenuPageClient from "./MenuPageClient";

export const metadata: Metadata = {
  title: "Menu | Hamid Afandi",
  description:
    "Explore the full Hamid Afandi café menu — coffee, hot drinks, fresh juices, cocktails, milkshakes, smoothies, soft drinks, and desserts.",
};

// Fetch is called at request time (not cached) because the API route
// is force-dynamic. When you switch to a real CMS, this fetch can be
// given a { next: { revalidate: 60 } } option instead.
async function getMenuSections(): Promise<MenuSection[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const res = await fetch(`${baseUrl}/api/menu`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch menu data");
  const data = await res.json();
  return data.sections as MenuSection[];
}

export default async function MenuPage() {
  const sections = await getMenuSections();
  return <MenuPageClient sections={sections} />;
}
