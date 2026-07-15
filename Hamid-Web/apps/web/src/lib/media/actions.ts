"use server";

import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";
import { db, media } from "@hamid/db";
import { presignUploadSchema } from "@hamid/core";
import { guardPermission } from "@/lib/auth/rbac";
import {
  createPresignedUploadUrl,
  deleteObject,
  objectKeyFor,
  publicMediaUrl,
  PUBLIC_BUCKET,
  PRIVATE_BUCKET,
  isStorageConfigured,
  STORAGE_NOT_CONFIGURED_ERROR,
} from "./s3";

export async function presignMediaUploadAction(input: unknown) {
  const guard = await guardPermission("media.manage");
  if ("error" in guard) return guard;

  if (!isStorageConfigured()) return { error: STORAGE_NOT_CONFIGURED_ERROR };

  const parsed = presignUploadSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid upload request." };

  const { filename, mime, folder, isPrivate } = parsed.data;
  const bucket = isPrivate ? PRIVATE_BUCKET : PUBLIC_BUCKET;
  const objectKey = objectKeyFor(folder, filename);
  const uploadUrl = await createPresignedUploadUrl(bucket, objectKey, mime);

  return { success: true as const, uploadUrl, objectKey, bucket };
}

export interface ConfirmMediaUploadInput {
  bucket: string;
  objectKey: string;
  mime: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  alt?: string;
  title?: string;
  folder?: string;
  isPrivate: boolean;
}

export async function confirmMediaUploadAction(input: ConfirmMediaUploadInput) {
  const guard = await guardPermission("media.manage");
  if ("error" in guard) return guard;

  const url = input.isPrivate ? "" : publicMediaUrl(input.objectKey);
  const [row] = await db
    .insert(media)
    .values({
      disk: "minio",
      bucket: input.bucket,
      objectKey: input.objectKey,
      url,
      mime: input.mime,
      width: input.width,
      height: input.height,
      sizeBytes: input.sizeBytes,
      alt: input.alt,
      title: input.title,
      folder: input.folder,
      isPrivate: input.isPrivate,
      uploadedBy: Number(guard.id),
    })
    .$returningId();

  revalidatePath("/admin/media");
  return { success: true as const, id: row.id, url };
}

export async function listPublicMediaAction() {
  const guard = await guardPermission("media.view");
  if ("error" in guard) return guard;

  const rows = await db
    .select({ id: media.id, url: media.url, alt: media.alt, title: media.title })
    .from(media)
    .where(eq(media.isPrivate, false))
    .orderBy(desc(media.createdAt))
    .limit(60);

  return { success: true as const, items: rows };
}

export async function deleteMediaAction(id: number) {
  const guard = await guardPermission("media.manage");
  if ("error" in guard) return guard;

  const [row] = await db.select().from(media).where(eq(media.id, id)).limit(1);
  if (!row) return { error: "Media not found." };

  await deleteObject(row.bucket, row.objectKey);
  await db.delete(media).where(eq(media.id, id));

  revalidatePath("/admin/media");
  return { success: true as const };
}
