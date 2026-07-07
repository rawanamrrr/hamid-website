import { menuSections } from "@/lib/menuData";
import type { MenuSection } from "@/lib/menuData";

// Force-dynamic: ensure every request reads the latest data.
// When you connect a real CMS, remove this export and let the
// caching strategy be dictated by your data source instead.
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const data: { sections: MenuSection[] } = { sections: menuSections };
  return Response.json(data);
}
