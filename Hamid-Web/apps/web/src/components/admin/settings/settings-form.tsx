"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateSiteSettingsAction, type SiteSettingsInput } from "@/lib/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, FormError } from "@/components/ui/card";

export function SettingsForm({ initial }: { initial: SiteSettingsInput }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    setSaved(false);
    const res = await updateSiteSettingsAction({
      siteNameEn: String(formData.get("siteNameEn")),
      siteNameAr: String(formData.get("siteNameAr")),
      currency: String(formData.get("currency")),
      deliveryFee: String(formData.get("deliveryFee")),
      taxEnabled: formData.get("taxEnabled") === "on",
      guestCheckoutEnabled: formData.get("guestCheckoutEnabled") === "on",
    });
    setPending(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <Card>
      <CardContent>
        <form action={onSubmit} className="space-y-5">
          <FormError>{error}</FormError>
          {saved && <p className="text-sm text-secondary">Settings saved.</p>}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="siteNameEn">Site name (English)</Label>
              <Input id="siteNameEn" name="siteNameEn" defaultValue={initial.siteNameEn} />
            </div>
            <div>
              <Label htmlFor="siteNameAr">Site name (Arabic)</Label>
              <Input id="siteNameAr" name="siteNameAr" dir="rtl" defaultValue={initial.siteNameAr} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="currency">Currency code</Label>
              <Input id="currency" name="currency" defaultValue={initial.currency} maxLength={3} />
            </div>
            <div>
              <Label htmlFor="deliveryFee">Flat delivery fee</Label>
              <Input id="deliveryFee" name="deliveryFee" type="number" step="0.01" defaultValue={initial.deliveryFee} />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-on-surface">
            <input type="checkbox" name="taxEnabled" defaultChecked={initial.taxEnabled} className="h-4 w-4 rounded border-outline-variant" />
            Apply tax to orders (not yet — Phase 1 default is off)
          </label>
          <label className="flex items-center gap-2 text-sm text-on-surface">
            <input
              type="checkbox"
              name="guestCheckoutEnabled"
              defaultChecked={initial.guestCheckoutEnabled}
              className="h-4 w-4 rounded border-outline-variant"
            />
            Allow guest checkout
          </label>

          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Save settings"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
