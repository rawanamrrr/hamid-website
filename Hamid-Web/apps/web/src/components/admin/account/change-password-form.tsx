"use client";

import { useActionState, useEffect, useRef } from "react";
import { changePasswordAction } from "@/lib/account/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, FormError } from "@/components/ui/card";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, null);
  const formRef = useRef<HTMLFormElement>(null);
  const succeeded = state !== null && "success" in state;

  useEffect(() => {
    if (succeeded) formRef.current?.reset();
  }, [succeeded]);

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <p className="mt-1 text-sm text-on-surface-variant">
          Update the password for your own account. You&apos;ll stay signed in.
        </p>
      </CardHeader>
      <CardContent>
        <form ref={formRef} action={formAction} className="space-y-4">
          {state && "error" in state && <FormError>{state.error}</FormError>}
          {succeeded && (
            <p className="rounded-lg bg-secondary-container px-3 py-2 text-sm text-on-secondary-container" role="status">
              Your password has been updated.
            </p>
          )}
          <div>
            <Label htmlFor="currentPassword">Current password</Label>
            <Input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" />
          </div>
          <div>
            <Label htmlFor="newPassword">New password</Label>
            <Input id="newPassword" name="newPassword" type="password" required minLength={8} autoComplete="new-password" />
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm new password</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Saving…" : "Update password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
