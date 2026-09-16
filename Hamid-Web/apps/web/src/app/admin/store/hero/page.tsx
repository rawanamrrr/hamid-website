import { asc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/mysql-core";
import { db, storeHeroImages, media } from "@hamid/db";
import { SectionTabs } from "@/components/admin/section-tabs";
import { HeroImagesManager } from "@/components/admin/store/hero-images-manager";

export default async function AdminStoreHeroPage() {
  const mobileMedia = alias(media, "mobile_media");
  const rows = await db
    .select({
      id: storeHeroImages.id,
      isActive: storeHeroImages.isActive,
      sortOrder: storeHeroImages.sortOrder,
      url: media.url,
      mobileUrl: mobileMedia.url,
    })
    .from(storeHeroImages)
    .innerJoin(media, eq(media.id, storeHeroImages.mediaId))
    .leftJoin(mobileMedia, eq(mobileMedia.id, storeHeroImages.mobileMediaId))
    .orderBy(asc(storeHeroImages.sortOrder));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-on-surface">Store</h1>
      <SectionTabs
        tabs={[
          { label: "Categories", href: "/admin/store" },
          { label: "Products", href: "/admin/store/products" },
          { label: "Hero Images", href: "/admin/store/hero" },
        ]}
      />
      <HeroImagesManager
        items={rows.map((r) => ({ id: r.id, isActive: r.isActive, url: r.url, mobileUrl: r.mobileUrl }))}
        nextSortOrder={rows.length}
      />
    </div>
  );
}
