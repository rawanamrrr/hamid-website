import { eq, inArray } from "drizzle-orm";
import { db, users, userRoles, roles } from "@hamid/db";
import { Table, Thead, Th, EmptyRow } from "@/components/admin/table";
import { UserRow } from "@/components/admin/users/user-row";
import { NewStaffForm } from "@/components/admin/users/new-staff-form";

const STAFF_ROLE_SLUGS = ["super_admin", "admin", "manager", "staff"] as const;

export default async function AdminUsersPage() {
  const rows = await db
    .select({ userId: users.id, fullName: users.fullName, email: users.email, status: users.status, roleSlug: roles.slug })
    .from(userRoles)
    .innerJoin(users, eq(users.id, userRoles.userId))
    .innerJoin(roles, eq(roles.id, userRoles.roleId))
    .where(inArray(roles.slug, STAFF_ROLE_SLUGS));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-on-surface">Users & Roles</h1>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Table>
            <Thead>
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th className="text-end">Actions</Th>
              </tr>
            </Thead>
            <tbody>
              {rows.map((u) => (
                <UserRow key={u.userId} userId={u.userId} fullName={u.fullName} email={u.email} status={u.status} roleSlug={u.roleSlug} />
              ))}
              {rows.length === 0 && <EmptyRow colSpan={5}>No staff users yet.</EmptyRow>}
            </tbody>
          </Table>
        </div>

        <NewStaffForm />
      </div>
    </div>
  );
}
