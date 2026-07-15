import { db, settings } from "@hamid/db";
import { SettingsForm } from "@/components/admin/settings/settings-form";

export default async function AdminSettingsPage() {
  const rows = await db.select().from(settings);
  const find = (group: string, key: string) => rows.find((r) => r.group === group && r.key === key)?.value;

  const siteName = (find("site", "name") as { en?: string; ar?: string } | undefined) ?? {};

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-on-surface">Settings</h1>
      <SettingsForm
        initial={{
          siteNameEn: siteName.en ?? "Hamid Afandi",
          siteNameAr: siteName.ar ?? "",
          currency: (find("site", "currency") as string) ?? "EGP",
          deliveryFee: (find("checkout", "delivery_fee") as string) ?? "30.00",
          taxEnabled: Boolean(find("checkout", "tax_enabled")),
          guestCheckoutEnabled: find("checkout", "guest_checkout_enabled") !== false,
        }}
      />
    </div>
  );
}
