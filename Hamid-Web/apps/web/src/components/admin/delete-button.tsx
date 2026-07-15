"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import type { ActionResult } from "@/lib/auth/rbac";

export function DeleteButton({
  action,
  confirmText = "Delete this item? This cannot be undone.",
}: {
  action: () => Promise<ActionResult>;
  confirmText?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <span className="inline-flex items-center">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (!confirm(confirmText)) return;
          startTransition(async () => {
            const res = await action();
            if ("error" in res) setError(res.error);
            else router.refresh();
          });
        }}
        className="text-error hover:opacity-70 disabled:opacity-40"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
      {error && <span className="ms-2 text-xs text-error">{error}</span>}
    </span>
  );
}
