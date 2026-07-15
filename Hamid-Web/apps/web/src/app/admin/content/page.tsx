import { and, asc, eq } from "drizzle-orm";
import { db, banners, bannerTranslations, media } from "@hamid/db";
import { BannersManager } from "@/components/admin/content/banners-manager";

export default async function AdminContentPage() {
  const rows = await db
    .select({ id: banners.id, url: media.url, placement: banners.placement, isActive: banners.isActive, title: bannerTranslations.title })
    .from(banners)
    .innerJoin(media, eq(media.id, banners.mediaId))
    .leftJoin(bannerTranslations, and(eq(bannerTranslations.bannerId, banners.id), eq(bannerTranslations.locale, "en")))
    .orderBy(asc(banners.sortOrder));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-on-surface">Home Page</h1>
      <p className="mt-1 text-sm text-on-surface-variant">Manage promotional banners shown across the site.</p>

      <div className="mt-6">
        <BannersManager items={rows.map((r) => ({ id: r.id, url: r.url, title: r.title, placement: r.placement, isActive: r.isActive }))} />
      </div>
    </div>
  );
}
