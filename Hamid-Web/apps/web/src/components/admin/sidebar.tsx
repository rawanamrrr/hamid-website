"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { ADMIN_NAV } from "@/lib/admin/nav";
import { ICON_MAP } from "./icon-map";
import { cn } from "@/lib/utils";

export function AdminSidebar({
  permissions,
  mobileOpen = false,
  onClose,
}: {
  permissions: string[];
  mobileOpen?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  const nav = (
    <>
      <div className="flex h-16 items-center justify-between gap-2 border-b border-outline-variant/60 px-6">
        <span className="font-display text-lg font-bold text-on-surface">Hamid Afandi</span>
        {onClose && (
          <button type="button" onClick={onClose} className="text-on-surface-variant md:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {ADMIN_NAV.map((group) => {
          const items = group.items.filter((item) => permissions.includes(item.permission));
          if (items.length === 0) return null;
          return (
            <div key={group.label} className="mb-6">
              <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                {group.label}
              </p>
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = ICON_MAP[item.icon];
                  const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-secondary-container text-on-secondary-container"
                          : "text-on-surface-variant hover:bg-surface-container",
                      )}
                    >
                      {Icon && <Icon size={18} />}
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop: static sidebar */}
      <nav className="hidden h-full w-64 shrink-0 flex-col border-e border-outline-variant/60 bg-surface-container-lowest md:flex">
        {nav}
      </nav>

      {/* Mobile: slide-in drawer + backdrop */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <nav className="absolute inset-y-0 start-0 flex w-72 max-w-[80vw] flex-col bg-surface-container-lowest shadow-xl">
            {nav}
          </nav>
        </div>
      )}
    </>
  );
}
