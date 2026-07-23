"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** Shared "where should this link go" list — reused by Hero slides, Category cards, and Instagram photos. */
export const SITE_PAGES = [
  { value: "/", label: "Home" },
  { value: "/menu", label: "Menu" },
  { value: "/store", label: "Store" },
  { value: "/store?category=coffee-beans", label: "Store — Coffee Beans" },
  { value: "/store?category=turkish-coffee", label: "Store — Turkish Coffee" },
  { value: "/store?category=espresso", label: "Store — Espresso" },
  { value: "/store?category=accessories", label: "Store — Accessories" },
  { value: "/coffee", label: "Coffee (our story)" },
  { value: "/about", label: "About" },
  { value: "/branches", label: "Branches" },
  { value: "/contact", label: "Contact" },
  { value: "/sourcing", label: "Sourcing" },
  { value: "/cart", label: "Cart" },
  { value: "/checkout", label: "Checkout" },
  { value: "/login", label: "Login" },
];
const CUSTOM_LINK = "__custom__";

export function LinkPicker({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const isKnownLink = value === "" || SITE_PAGES.some((p) => p.value === value);
  const selectValue = isKnownLink ? value : CUSTOM_LINK;

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        value={selectValue}
        onChange={(e) => onChange(e.target.value === CUSTOM_LINK ? "" : e.target.value)}
        className="flex h-11 w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface"
      >
        <option value="">— None —</option>
        {SITE_PAGES.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
        <option value={CUSTOM_LINK}>Custom URL…</option>
      </select>
      {selectValue === CUSTOM_LINK && (
        <Input className="mt-2" placeholder="https://... or /path" value={value} onChange={(e) => onChange(e.target.value)} autoFocus />
      )}
    </div>
  );
}
