import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/rbac";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Defense in depth: proxy.ts already gates /admin, but a page-level check
  // costs nothing and covers any future matcher changes (see proxy.ts note).
  const user = await getSessionUser();
  if (!user || !user.permissions.includes("dashboard.view")) {
    redirect("/login?callbackUrl=/admin");
  }

  return (
    <AdminShell permissions={user.permissions} name={user.name ?? user.email ?? "Admin"} email={user.email ?? ""}>
      {children}
    </AdminShell>
  );
}
