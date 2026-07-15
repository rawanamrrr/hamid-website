import Link from "next/link";
import Image from "next/image";
import { and, asc, eq } from "drizzle-orm";
import { db, banners, bannerTranslations, media } from "@hamid/db";
import { getLocale } from "@/lib/i18n";

export default async function PromoBanner({ placement = "home_top" }: { placement?: string }) {
  const locale = await getLocale();

  const rows = await db
    .select({ id: banners.id, url: media.url, linkUrl: banners.linkUrl, title: bannerTranslations.title, ctaText: bannerTranslations.ctaText })
    .from(banners)
    .innerJoin(media, eq(media.id, banners.mediaId))
    .leftJoin(bannerTranslations, and(eq(bannerTranslations.bannerId, banners.id), eq(bannerTranslations.locale, locale)))
    .where(and(eq(banners.isActive, true), eq(banners.placement, placement)))
    .orderBy(asc(banners.sortOrder))
    .limit(1);

  const banner = rows[0];
  if (!banner) return null;

  const content = (
    <div className="relative h-40 w-full overflow-hidden rounded-2xl md:h-56">
      <Image src={banner.url} alt={banner.title ?? ""} fill unoptimized className="object-cover" />
      {banner.title && (
        <div className="absolute inset-0 flex items-center bg-black/30 px-8">
          <p className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold text-white md:text-3xl">{banner.title}</p>
        </div>
      )}
    </div>
  );

  return (
    <section className="px-5 py-6 md:px-16 max-w-[1280px] mx-auto">
      {banner.linkUrl ? <Link href={banner.linkUrl}>{content}</Link> : content}
    </section>
  );
}
