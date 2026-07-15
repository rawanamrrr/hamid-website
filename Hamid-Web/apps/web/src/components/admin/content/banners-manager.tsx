"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { Trash2 } from "lucide-react";
import { MediaPicker, type PickedMedia } from "@/components/admin/media-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, FormError } from "@/components/ui/card";
import { createBannerAction, toggleBannerActiveAction, deleteBannerAction } from "@/lib/content/actions";

interface BannerItem {
  id: number;
  url: string;
  title: string | null;
  placement: string;
  isActive: boolean;
}

const PLACEMENTS = [
  { value: "home_top", label: "Home — top" },
  { value: "home_mid", label: "Home — middle" },
  { value: "store_top", label: "Store — top" },
];

export function BannersManager({ items }: { items: BannerItem[] }) {
  const router = useRouter();
  const [image, setImage] = useState<PickedMedia | null>(null);
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [placement, setPlacement] = useState("home_top");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

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
        isActive: true,
        sortOrder: items.length,
      });
      if ("error" in res) setError(res.error);
      else {
        setImage(null);
        setTitleEn("");
        setTitleAr("");
        setLinkUrl("");
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <FormError>{error}</FormError>
          <MediaPicker value={image} onChange={setImage} label="Banner image" />
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="linkUrl">Link (optional)</Label>
              <Input id="linkUrl" placeholder="/store" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="placement">Placement</Label>
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
            </div>
          </div>
          <Button type="button" onClick={addBanner} disabled={pending}>
            Add banner
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {items.map((b) => (
          <div key={b.id} className="overflow-hidden rounded-xl border border-outline-variant/60 bg-surface-container-lowest">
            <div className="relative aspect-video">
              <NextImage src={b.url} alt={b.title ?? ""} fill unoptimized className="object-cover" />
            </div>
            <div className="flex items-center justify-between p-3">
              <div>
                <p className="text-xs font-semibold text-on-surface">{b.title ?? "Untitled"}</p>
                <p className="text-xs text-on-surface-variant">{b.placement}</p>
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    defaultChecked={b.isActive}
                    onChange={(e) =>
                      startTransition(async () => {
                        await toggleBannerActiveAction(b.id, e.target.checked);
                        router.refresh();
                      })
                    }
                  />
                  Active
                </label>
                <button
                  type="button"
                  onClick={() =>
                    startTransition(async () => {
                      await deleteBannerAction(b.id);
                      router.refresh();
                    })
                  }
                  className="text-error hover:opacity-70"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-full text-sm text-on-surface-variant">No banners yet.</p>}
      </div>
    </div>
  );
}
