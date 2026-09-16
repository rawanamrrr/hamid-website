import { asc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";
import { db, menuHeroImages, media } from "@hamid/db";
import { SectionTabs } from "@/components/admin/section-tabs";
import { HeroImagesManager } from "@/components/admin/menu/hero-images-manager";

export default async function AdminMenuHeroPage() {
  const mobileMedia = alias(media, "mobile_media");
  const rows = await db
    .select({
      id: menuHeroImages.id,
      isActive: menuHeroImages.isActive,
      sortOrder: menuHeroImages.sortOrder,
      url: media.url,
      mobileUrl: mobileMedia.url,
    })
    .from(menuHeroImages)
    .innerJoin(media, eq(media.id, menuHeroImages.mediaId))
    .leftJoin(mobileMedia, eq(mobileMedia.id, menuHeroImages.mobileMediaId))
    .orderBy(asc(menuHeroImages.sortOrder));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-on-surface">Menu</h1>
      <SectionTabs
        tabs={[
          { label: "Categories", href: "/admin/menu" },
          { label: "Items", href: "/admin/menu/items" },
          { label: "Hero Images", href: "/admin/menu/hero" },
        ]}
      />
      <HeroImagesManager
        items={rows.map((r) => ({ id: r.id, isActive: r.isActive, url: r.url, mobileUrl: r.mobileUrl }))}
        nextSortOrder={rows.length}
      />
    </div>
  );
}
