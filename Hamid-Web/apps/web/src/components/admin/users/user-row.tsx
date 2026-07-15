"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateUserRoleAction, toggleUserStatusAction } from "@/lib/users/actions";
import { Tr, Td } from "@/components/admin/table";

const ROLE_OPTIONS = ["admin", "manager", "staff"] as const;

export function UserRow({
  userId,
  fullName,
  email,
  status,
  roleSlug,
}: {
  userId: number;
  fullName: string;
  email: string;
  status: string;
  roleSlug: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const isSuperAdmin = roleSlug === "super_admin";

  return (
    <Tr>
      <Td className="font-medium">{fullName}</Td>
      <Td className="text-on-surface-variant">{email}</Td>
      <Td>
        {isSuperAdmin ? (
          <span className="text-xs font-semibold uppercase text-on-surface-variant">Super Admin</span>
        ) : (
          <select
            defaultValue={roleSlug}
            disabled={pending}
            onChange={(e) =>
              startTransition(async () => {
                const res = await updateUserRoleAction(userId, e.target.value as (typeof ROLE_OPTIONS)[number]);
                if ("error" in res) setError(res.error);
                else router.refresh();
              })
            }
            className="h-9 rounded-lg border border-outline-variant bg-surface-container-lowest px-2 text-xs text-on-surface"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r} className="capitalize">
                {r}
              </option>
            ))}
          </select>
        )}
      </Td>
      <Td>
        <span
          className={
            status === "active"
              ? "rounded-full bg-secondary-container px-2 py-0.5 text-xs text-on-secondary-container"
              : "rounded-full bg-error-container px-2 py-0.5 text-xs text-on-error-container"
          }
        >
          {status}
        </span>
      </Td>
      <Td className="text-end">
        {!isSuperAdmin && (
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                const res = await toggleUserStatusAction(userId, status === "active" ? "suspended" : "active");
                if ("error" in res) setError(res.error);
                else router.refresh();
              })
            }
            className="text-xs font-semibold text-primary hover:underline"
          >
            {status === "active" ? "Suspend" : "Reactivate"}
          </button>
        )}
        {error && <p className="mt-1 text-xs text-error">{error}</p>}
      </Td>
    </Tr>
  );
}
