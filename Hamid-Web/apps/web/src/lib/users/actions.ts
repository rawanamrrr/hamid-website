"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, users, roles, userRoles } from "@hamid/db";
import { registerSchema } from "@hamid/core";
import { guardPermission, type ActionResult } from "@/lib/auth/rbac";
import { logActivity } from "@/lib/activity/log";

/** Staff-assignable roles only — super_admin is seeded once and never granted via this UI. */
const ASSIGNABLE_ROLES = ["admin", "manager", "staff"] as const;
type AssignableRole = (typeof ASSIGNABLE_ROLES)[number];

export async function createStaffUserAction(input: {
  fullName: string;
  email: string;
  password: string;
  roleSlug: AssignableRole;
}): Promise<ActionResult<{ id: number }>> {
  const guard = await guardPermission("users.manage");
  if ("error" in guard) return guard;

  if (!ASSIGNABLE_ROLES.includes(input.roleSlug)) return { error: "Invalid role." };

  const parsed = registerSchema.safeParse({ fullName: input.fullName, email: input.email, password: input.password });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, input.email)).limit(1);
  if (existing) return { error: "An account with this email already exists." };

  const [role] = await db.select({ id: roles.id }).from(roles).where(eq(roles.slug, input.roleSlug)).limit(1);
  if (!role) return { error: "Role not found." };

  const passwordHash = await bcrypt.hash(input.password, 12);
  const id = await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(users)
      .values({ email: input.email, fullName: input.fullName, passwordHash, status: "active", emailVerifiedAt: new Date() })
      .$returningId();
    await tx.insert(userRoles).values({ userId: user.id, roleId: role.id });
    return user.id;
  });

  await logActivity({ actorUserId: Number(guard.id), action: "user.created", entityType: "user", entityId: id, changes: { roleSlug: input.roleSlug } });

  revalidatePath("/admin/users");
  return { success: true, data: { id } };
}

export async function updateUserRoleAction(userId: number, roleSlug: AssignableRole): Promise<ActionResult> {
  const guard = await guardPermission("users.manage");
  if ("error" in guard) return guard;

  if (!ASSIGNABLE_ROLES.includes(roleSlug)) return { error: "Invalid role." };

  const [role] = await db.select({ id: roles.id }).from(roles).where(eq(roles.slug, roleSlug)).limit(1);
  if (!role) return { error: "Role not found." };

  await db.transaction(async (tx) => {
    await tx.delete(userRoles).where(eq(userRoles.userId, userId));
    await tx.insert(userRoles).values({ userId, roleId: role.id });
  });

  await logActivity({ actorUserId: Number(guard.id), action: "user.role_changed", entityType: "user", entityId: userId, changes: { roleSlug } });

  revalidatePath("/admin/users");
  return { success: true };
}

export async function toggleUserStatusAction(userId: number, status: "active" | "suspended"): Promise<ActionResult> {
  const guard = await guardPermission("users.manage");
  if ("error" in guard) return guard;

  await db.update(users).set({ status }).where(eq(users.id, userId));
  await logActivity({ actorUserId: Number(guard.id), action: "user.status_changed", entityType: "user", entityId: userId, changes: { status } });
  revalidatePath("/admin/users");
  return { success: true };
}
