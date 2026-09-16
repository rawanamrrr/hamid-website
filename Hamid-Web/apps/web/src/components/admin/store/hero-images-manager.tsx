"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import NextImage from "next/image";
import { Trash2, Plus } from "lucide-react";
import { MediaPicker, type PickedMedia } from "@/components/admin/media-picker";
import { Button } from "@/components/ui/button";
import { createStoreHeroImageAction, toggleStoreHeroImageAction, deleteStoreHeroImageAction } from "@/lib/store/actions";
import { toast } from "@/components/ui/toast";

interface HeroItem {
  id: number;
  isActive: boolean;
  url: string;
  mobileUrl: string | null;
}

export function HeroImagesManager({ items, nextSortOrder }: { items: HeroItem[]; nextSortOrder: number }) {
  const router = useRouter();
  const [desktopImage, setDesktopImage] = useState<PickedMedia | null>(null);
  const [mobileImage, setMobileImage] = useState<PickedMedia | null>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function addImage() {
    if (!desktopImage) {
      setError("Choose a desktop image first.");
      return;
    }
    startTransition(async () => {
      const res = await createStoreHeroImageAction({
        mediaId: desktopImage.id,
        mobileMediaId: mobileImage?.id,
        sortOrder: nextSortOrder,
        isActive: true,
      });
      if ("error" in res) {
        setError(res.error);
        toast(res.error, "error");
      } else {
        toast("Hero image added.");
        setDesktopImage(null);
        setMobileImage(null);
        router.refresh();
      }
    });
  }

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-end">
        <MediaPicker value={desktopImage} onChange={setDesktopImage} label="Hero image (desktop)" />
        <div>
          <MediaPicker value={mobileImage} onChange={setMobileImage} label="Hero image (mobile, optional)" />
          <p className="mt-1 text-xs text-on-surface-variant">Shown on small screens instead of the desktop image — leave blank to reuse it.</p>
        </div>
        <Button type="button" onClick={addImage} loading={pending} className="sm:col-span-2 sm:w-fit">
          Add hero image
        </Button>
        {error && <p className="text-sm text-error sm:col-span-2">{error}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {items.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-xl border border-outline-variant/60 bg-surface-container-lowest">
            <div className="flex">
              <div className="relative aspect-video flex-1">
                <NextImage src={item.url} alt="" fill className="object-cover" />
              </div>
              {item.mobileUrl && (
                <div className="relative aspect-[9/16] w-12 shrink-0 ring-2 ring-primary/40" title="Mobile image">
                  <NextImage src={item.mobileUrl} alt="" fill className="object-cover" />
                </div>
              )}
            </div>
            <div className="flex items-center justify-between p-3">
              <label className="flex items-center gap-2 text-xs text-on-surface">
                <input
                  type="checkbox"
                  defaultChecked={item.isActive}
                  disabled={pending}
                  onChange={(e) =>
                    startTransition(async () => {
                      await toggleStoreHeroImageAction(item.id, e.target.checked);
                      router.refresh();
                    })
                  }
                  className="h-4 w-4 rounded border-outline-variant"
                />
                Active
              </label>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await deleteStoreHeroImageAction(item.id);
                    toast("Hero image removed.");
                    router.refresh();
                  })
                }
                className="text-error hover:opacity-70"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p className="col-span-full flex items-center gap-2 text-sm text-on-surface-variant">
            <Plus size={14} /> No hero images yet — add one above.
          </p>
        )}
      </div>
    </div>
  );
}
