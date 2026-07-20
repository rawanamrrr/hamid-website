import { and, asc, eq } from "drizzle-orm";
import { db, banners, bannerTranslations, media } from "@hamid/db";
import { BannersManager } from "@/components/admin/content/banners-manager";
import { withDbTimeout } from "@/lib/db-timeout";

export default async function AdminContentPage() {
  const rows = await withDbTimeout(db
    .select({ id: banners.id, url: media.url, placement: banners.placement, isActive: banners.isActive, title: bannerTranslations.title })
    .from(banners)
    .innerJoin(media, eq(media.id, banners.mediaId))
    .leftJoin(bannerTranslations, and(eq(bannerTranslations.bannerId, banners.id), eq(bannerTranslations.locale, "en")))
    .orderBy(asc(banners.sortOrder)))
    .catch(() => null);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-on-surface">Home Page</h1>
      <p className="mt-1 text-sm text-on-surface-variant">
        Manage the homepage hero slider and promotional banners — images, copy, order, and visibility.
      </p>

      <div className="mt-6">
        {rows === null ? (
          <p className="rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-6 text-sm text-on-surface-variant">
            Couldn&apos;t reach the database — refresh the page to try again.
          </p>
        ) : (
          <BannersManager items={rows.map((r) => ({ id: r.id, url: r.url, title: r.title, placement: r.placement, isActive: r.isActive }))} />
        )}
      </div>
    </div>
  );
}
