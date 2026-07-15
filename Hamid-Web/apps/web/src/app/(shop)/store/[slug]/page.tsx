import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { getStoreProductBySlug } from "@/lib/store/queries";
import { getLocale, getDict } from "@/lib/i18n";
import { ProductDetail } from "@/components/ProductDetail";

export default async function StoreProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [locale, dict] = await Promise.all([getLocale(), getDict()]);
  const product = await getStoreProductBySlug(slug, locale);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 md:px-16 md:py-16">
      <Link href="/store" className="mb-8 inline-flex items-center gap-1 text-sm font-semibold text-[#7b5800] hover:underline">
        <ChevronLeft size={16} />
        {dict.store.title}
      </Link>
      <ProductDetail
        product={product}
        dict={{ addToCart: dict.product.addToCart, added: dict.product.added, outOfStock: dict.product.outOfStock }}
      />
    </div>
  );
}
