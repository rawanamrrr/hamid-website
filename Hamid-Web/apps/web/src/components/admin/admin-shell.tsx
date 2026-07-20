"use client";

import { useState } from "react";
import { AdminSidebar } from "./sidebar";
import { AdminTopbar } from "./topbar";

/**
 * Wraps the sidebar + topbar so the mobile hamburger toggle (in the topbar)
 * and the drawer it opens (the sidebar) can share state — the dashboard was
 * previously unusable on phones (fixed w-64 sidebar, no responsive handling).
 */
export function AdminShell({
  permissions,
  name,
  email,
  children,
}: {
  permissions: string[];
  name: string;
  email: string;
  children: React.ReactNode;
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <AdminSidebar permissions={permissions} mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar name={name} email={email} onOpenNav={() => setMobileNavOpen(true)} />
        <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
