"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MediaPicker, type PickedMedia } from "@/components/admin/media-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, FormError } from "@/components/ui/card";
import { toast } from "@/components/ui/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { saveInstagramPhotoAction } from "@/lib/content/actions";
import type { InstagramPhotoKey, InstagramPhotoPayload } from "@/lib/content/queries";

export interface InstagramPhotoItem {
  key: InstagramPhotoKey;
  label: string;
  current: InstagramPhotoPayload;
}

function PhotoEditor({ item }: { item: InstagramPhotoItem }) {
  const router = useRouter();
  const { current } = item;
  const [image, setImage] = useState<PickedMedia | null>({ id: current.mediaId, url: current.imageUrl });
  const [linkUrl, setLinkUrl] = useState(current.linkUrl);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function save() {
    if (!image) {
      setError("Choose an image first.");
      return;
    }
    if (linkUrl.trim() && !/^https?:\/\/\S+$/i.test(linkUrl.trim())) {
      setError("Enter a full URL starting with https://");
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await saveInstagramPhotoAction(item.key, { mediaId: image.id, imageUrl: image.url, linkUrl: linkUrl.trim() });
      if ("error" in res) {
        setError(res.error);
        toast(res.error, "error");
      } else {
        toast(`${item.label} updated.`);
        router.refresh();
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{item.label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormError>{error}</FormError>
        <MediaPicker value={image} onChange={setImage} label="Photo" />
        <div className="space-y-1.5">
          <Label htmlFor={`${item.key}-link`}>Opens (optional)</Label>
          <Input
            id={`${item.key}-link`}
            type="url"
            dir="ltr"
            placeholder="https://www.instagram.com/p/..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
        </div>
        <Button type="button" onClick={save} loading={pending}>
          Save
        </Button>
      </CardContent>
    </Card>
  );
}

export function InstagramPhotosManager({ items }: { items: InstagramPhotoItem[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <PhotoEditor key={item.key} item={item} />
      ))}
    </div>
  );
}
