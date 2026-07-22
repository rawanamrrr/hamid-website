import Link from "next/link";
import Image from "next/image";
import { getLocale } from "@/lib/i18n";
import { getPromoBanner } from "@/lib/content/queries";

export default async function PromoBanner({ placement = "home_top" }: { placement?: string }) {
  const locale = await getLocale();
  const banner = await getPromoBanner(placement, locale);
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
