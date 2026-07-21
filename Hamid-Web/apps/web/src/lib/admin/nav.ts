import type { PermissionSlug } from "@hamid/core";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: string; // lucide-react icon name
  permission: PermissionSlug;
}

export interface AdminNavGroup {
  label: string;
  items: AdminNavItem[];
}

export const ADMIN_NAV: AdminNavGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", href: "/admin", icon: "LayoutDashboard", permission: "dashboard.view" }],
  },
  {
    label: "Catalog",
    items: [
      { label: "Menu", href: "/admin/menu", icon: "Coffee", permission: "menu.view" },
      { label: "Store", href: "/admin/store", icon: "Store", permission: "store.view" },
      { label: "Discounts", href: "/admin/discounts", icon: "Percent", permission: "discounts.view" },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "Orders", href: "/admin/orders", icon: "ShoppingBag", permission: "orders.view" },
      { label: "Payments", href: "/admin/payments", icon: "CreditCard", permission: "payments.view" },
      { label: "Customers", href: "/admin/customers", icon: "Users", permission: "customers.view" },
    ],
  },
  {
    label: "Content",
    items: [
      { label: "Home Page", href: "/admin/content", icon: "Home", permission: "content.view" },
      { label: "Media Library", href: "/admin/media", icon: "Image", permission: "media.view" },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Users & Roles", href: "/admin/users", icon: "ShieldCheck", permission: "users.view" },
      { label: "Roles", href: "/admin/roles", icon: "KeyRound", permission: "roles.manage" },
      { label: "Branches", href: "/admin/branches", icon: "MapPin", permission: "branches.view" },
      { label: "Settings", href: "/admin/settings", icon: "Settings", permission: "settings.manage" },
      { label: "Activity Logs", href: "/admin/activity", icon: "History", permission: "activity.view" },
      // Every dashboard user (any role) can manage their own account.
      { label: "My Account", href: "/admin/account", icon: "UserCog", permission: "dashboard.view" },
    ],
  },
];
