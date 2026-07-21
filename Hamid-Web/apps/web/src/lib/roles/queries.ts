import "server-only";
import { asc, count, eq } from "drizzle-orm";
import { db, roles, rolePermissions, permissions, userRoles } from "@hamid/db";

export interface RoleView {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  isSystem: boolean;
  permissionSlugs: string[];
  userCount: number;
}

export async function getAllRoles(): Promise<RoleView[]> {
  const roleRows = await db.select().from(roles).orderBy(asc(roles.isSystem), asc(roles.name));

  const [permRows, userCounts] = await Promise.all([
    db
      .select({ roleId: rolePermissions.roleId, slug: permissions.slug })
      .from(rolePermissions)
      .innerJoin(permissions, eq(permissions.id, rolePermissions.permissionId)),
    db.select({ roleId: userRoles.roleId, total: count() }).from(userRoles).groupBy(userRoles.roleId),
  ]);

  const userCountByRole = new Map(userCounts.map((r) => [r.roleId, r.total]));

  return roleRows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    description: r.description,
    isSystem: r.isSystem,
    permissionSlugs: permRows.filter((p) => p.roleId === r.id).map((p) => p.slug),
    userCount: userCountByRole.get(r.id) ?? 0,
  }));
}

/** Roles a customer-facing account should never be assigned via the staff UI — kept out of the "assign to staff" pickers. */
export const NON_STAFF_ROLE_SLUGS = ["customer"] as const;
