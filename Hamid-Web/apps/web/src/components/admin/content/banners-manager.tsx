"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";
import { MediaPicker, type PickedMedia } from "@/components/admin/media-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, FormError } from "@/components/ui/card";
import {
  createBannerAction,
  toggleBannerActiveAction,
  deleteBannerAction,
  reorderBannersAction,
} from "@/lib/content/actions";

interface BannerItem {
  id: number;
  url: string;
  title: string | null;
  placement: string;
  isActive: boolean;
}

const PLACEMENTS = [
  { value: "home_hero", label: "Home — hero slider" },
  { value: "home_top", label: "Home — top banner" },
  { value: "home_mid", label: "Home — middle banner" },
  { value: "store_top", label: "Store — top banner" },
];

const placementLabel = (value: string) => PLACEMENTS.find((p) => p.value === value)?.label ?? value;

export function BannersManager({ items }: { items: BannerItem[] }) {
  const router = useRouter();
  const [image, setImage] = useState<PickedMedia | null>(null);
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [subtitleEn, setSubtitleEn] = useState("");
  const [subtitleAr, setSubtitleAr] = useState("");
  const [ctaTextEn, setCtaTextEn] = useState("");
  const [ctaTextAr, setCtaTextAr] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [placement, setPlacement] = useState("home_hero");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const heroSlides = items.filter((b) => b.placement === "home_hero");
  const otherBanners = items.filter((b) => b.placement !== "home_hero");
  const isHero = placement === "home_hero";

  function addBanner() {
    if (!image) {
      setError("Choose an image first.");
      return;
    }
    startTransition(async () => {
      const res = await createBannerAction({
        mediaId: image.id,
        linkUrl,
        placement,
        titleEn,
        titleAr,
        subtitleEn,
        subtitleAr,
        ctaTextEn,
        ctaTextAr,
        isActive: true,
        sortOrder: items.filter((b) => b.placement === placement).length,
      });
      if ("error" in res) setError(res.error);
      else {
        setImage(null);
        setTitleEn("");
        setTitleAr("");
        setSubtitleEn("");
        setSubtitleAr("");
        setCtaTextEn("");
        setCtaTextAr("");
        setLinkUrl("");
        router.refresh();
      }
    });
  }

  function moveSlide(index: number, delta: -1 | 1) {
    const target = index + delta;
    if (target < 0 || target >= heroSlides.length) return;
    const ids = heroSlides.map((s) => s.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    startTransition(async () => {
      await reorderBannersAction(ids);
      router.refresh();
    });
  }

  function toggleActive(id: number, isActive: boolean) {
    startTransition(async () => {
      await toggleBannerActiveAction(id, isActive);
      router.refresh();
    });
  }

  function remove(id: number) {
    startTransition(async () => {
      await deleteBannerAction(id);
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      {/* ── Add form ─────────────────────────────────────────────────── */}
      <Card>
        <CardContent className="space-y-4">
          <FormError>{error}</FormError>
          <div>
            <Label htmlFor="placement">Location</Label>
            <select
              id="placement"
              value={placement}
              onChange={(e) => setPlacement(e.target.value)}
              className="flex h-11 w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface"
            >
              {PLACEMENTS.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            {isHero && (
              <p className="mt-1.5 text-xs text-on-surface-variant">
                Hero slides rotate automatically. Add one slide for a static hero, or several for a slider —
                the slide count is simply how many active slides exist. Text fields are optional: empty
                fields fall back to the site&apos;s default hero copy.
              </p>
            )}
          </div>
          <MediaPicker value={image} onChange={setImage} label={isHero ? "Slide image" : "Banner image"} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="titleEn">Title (English)</Label>
              <Input id="titleEn" value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="titleAr">Title (Arabic)</Label>
              <Input id="titleAr" dir="rtl" value={titleAr} onChange={(e) => setTitleAr(e.target.value)} />
            </div>
          </div>
          {isHero && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="subtitleEn">Subtitle (English)</Label>
                  <Input id="subtitleEn" value={subtitleEn} onChange={(e) => setSubtitleEn(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="subtitleAr">Subtitle (Arabic)</Label>
                  <Input id="subtitleAr" dir="rtl" value={subtitleAr} onChange={(e) => setSubtitleAr(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="ctaTextEn">Button text (English)</Label>
                  <Input id="ctaTextEn" placeholder="Shop Coffee" value={ctaTextEn} onChange={(e) => setCtaTextEn(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="ctaTextAr">Button text (Arabic)</Label>
                  <Input id="ctaTextAr" dir="rtl" value={ctaTextAr} onChange={(e) => setCtaTextAr(e.target.value)} />
                </div>
              </div>
            </>
          )}
          <div>
            <Label htmlFor="linkUrl">{isHero ? "Button link (optional)" : "Link (optional)"}</Label>
            <Input id="linkUrl" placeholder="/store" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
          </div>
          <Button type="button" onClick={addBanner} disabled={pending}>
            {isHero ? "Add hero slide" : "Add banner"}
          </Button>
        </CardContent>
      </Card>

      {/* ── Hero slides ──────────────────────────────────────────────── */}
      <section>
        <h2 className="font-display text-lg font-bold text-on-surface">Hero slides</h2>
        <p className="mb-4 mt-0.5 text-sm text-on-surface-variant">
          Shown at the top of the homepage, in this order.
        </p>
        <div className="space-y-3">
          {heroSlides.map((slide, i) => (
            <div
              key={slide.id}
              className="flex items-center gap-3 rounded-xl border border-outline-variant/60 bg-surface-container-lowest p-3"
            >
              <span className="w-6 shrink-0 text-center text-sm font-semibold text-on-surface-variant">{i + 1}</span>
              <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg">
                <NextImage src={slide.url} alt={slide.title ?? ""} fill unoptimized className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-on-surface">{slide.title ?? "Default hero copy"}</p>
                <p className="text-xs text-on-surface-variant">{slide.isActive ? "Visible" : "Hidden"}</p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => moveSlide(i, -1)}
                  disabled={pending || i === 0}
                  aria-label="Move up"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant text-on-surface disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => moveSlide(i, 1)}
                  disabled={pending || i === heroSlides.length - 1}
                  aria-label="Move down"
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-outline-variant text-on-surface disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
                <label className="ms-1 flex items-center gap-1 text-xs">
                  <input type="checkbox" defaultChecked={slide.isActive} onChange={(e) => toggleActive(slide.id, e.target.checked)} />
                  Active
                </label>
                <button type="button" onClick={() => remove(slide.id)} aria-label="Delete slide" className="ms-1 p-1 text-error hover:opacity-70">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
          {heroSlides.length === 0 && (
            <p className="rounded-xl border border-dashed border-outline-variant/60 p-6 text-center text-sm text-on-surface-variant">
              No hero slides yet — the homepage shows the built-in default hero. Add a slide above to take control.
            </p>
          )}
        </div>
      </section>

      {/* ── Promotional banners ──────────────────────────────────────── */}
      <section>
        <h2 className="font-display text-lg font-bold text-on-surface">Promotional banners</h2>
        <p className="mb-4 mt-0.5 text-sm text-on-surface-variant">Standalone banners placed around the site.</p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {otherBanners.map((b) => (
            <div key={b.id} className="overflow-hidden rounded-xl border border-outline-variant/60 bg-surface-container-lowest">
              <div className="relative aspect-video">
                <NextImage src={b.url} alt={b.title ?? ""} fill unoptimized className="object-cover" />
              </div>
              <div className="flex items-center justify-between gap-2 p-3">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-on-surface">{b.title ?? "Untitled"}</p>
                  <p className="truncate text-xs text-on-surface-variant">{placementLabel(b.placement)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <label className="flex items-center gap-1 text-xs">
                    <input type="checkbox" defaultChecked={b.isActive} onChange={(e) => toggleActive(b.id, e.target.checked)} />
                    Active
                  </label>
                  <button type="button" onClick={() => remove(b.id)} aria-label="Delete banner" className="text-error hover:opacity-70">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {otherBanners.length === 0 && <p className="col-span-full text-sm text-on-surface-variant">No banners yet.</p>}
        </div>
      </section>
    </div>
  );
}
