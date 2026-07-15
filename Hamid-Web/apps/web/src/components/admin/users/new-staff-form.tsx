"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createStaffUserAction } from "@/lib/users/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, FormError } from "@/components/ui/card";

export function NewStaffForm() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    const res = await createStaffUserAction({
      fullName: String(formData.get("fullName")),
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      roleSlug: formData.get("roleSlug") as "admin" | "manager" | "staff",
    });
    setPending(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add staff member</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={onSubmit} className="space-y-4">
          <FormError>{error}</FormError>
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" name="fullName" required />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div>
            <Label htmlFor="password">Temporary password</Label>
            <Input id="password" name="password" type="password" minLength={8} required />
          </div>
          <div>
            <Label htmlFor="roleSlug">Role</Label>
            <select
              id="roleSlug"
              name="roleSlug"
              defaultValue="staff"
              className="flex h-11 w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-3 text-sm text-on-surface"
            >
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="staff">Staff</option>
            </select>
          </div>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Creating…" : "Create account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
