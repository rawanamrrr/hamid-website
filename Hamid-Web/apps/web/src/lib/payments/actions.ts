"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { db, payments, media } from "@hamid/db";
import { presignUploadSchema } from "@hamid/core";
import { createPresignedUploadUrl, objectKeyFor, PRIVATE_BUCKET, isStorageConfigured, STORAGE_NOT_CONFIGURED_ERROR } from "@/lib/media/s3";
import { getOwnedOrder } from "@/lib/orders/queries";
import type { ActionResult } from "@/lib/auth/rbac";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function presignPaymentProofUploadAction(
  orderNumber: string,
  input: { filename: string; mime: string; sizeBytes: number },
): Promise<ActionResult<{ uploadUrl: string; objectKey: string }>> {
  // 10 upload attempts per 10 minutes per IP — generous for a legitimate
  // customer retrying a bad screenshot, tight enough to blunt abuse.
  const limited = await enforceRateLimit("payment-proof-upload", 10, 10 * 60 * 1000);
  if (!limited.ok) return { error: limited.error };

  if (!isStorageConfigured()) return { error: STORAGE_NOT_CONFIGURED_ERROR };

  const order = await getOwnedOrder(orderNumber);
  if (!order) return { error: "Order not found." };

  const parsed = presignUploadSchema.safeParse({ ...input, isPrivate: true, folder: "payment-proofs" });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid file." };

  const objectKey = objectKeyFor("payment-proofs", parsed.data.filename);
  const uploadUrl = await createPresignedUploadUrl(PRIVATE_BUCKET, objectKey, parsed.data.mime);
  return { success: true, data: { uploadUrl, objectKey } };
}

export async function confirmPaymentProofAction(
  orderNumber: string,
  input: { objectKey: string; mime: string; sizeBytes: number },
): Promise<ActionResult> {
  const order = await getOwnedOrder(orderNumber);
  if (!order) return { error: "Order not found." };

  const [payment] = await db.select().from(payments).where(eq(payments.orderId, order.id)).limit(1);
  if (!payment) return { error: "Payment record not found." };

  const [mediaRow] = await db
    .insert(media)
    .values({
      disk: "minio",
      bucket: PRIVATE_BUCKET,
      objectKey: input.objectKey,
      url: "",
      mime: input.mime,
      sizeBytes: input.sizeBytes,
      isPrivate: true,
      folder: "payment-proofs",
    })
    .$returningId();

  await db
    .update(payments)
    .set({ status: "submitted", proofMediaId: mediaRow.id })
    .where(and(eq(payments.id, payment.id)));

  revalidatePath(`/order/${orderNumber}`);
  revalidatePath("/admin/payments");
  return { success: true };
}
