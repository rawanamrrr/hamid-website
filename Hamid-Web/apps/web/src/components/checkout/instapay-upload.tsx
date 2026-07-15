"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { presignPaymentProofUploadAction, confirmPaymentProofAction } from "@/lib/payments/actions";

export function InstapayUpload({ orderNumber, hint }: { orderNumber: string; hint: string }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);

    const presign = await presignPaymentProofUploadAction(orderNumber, {
      filename: file.name,
      mime: file.type,
      sizeBytes: file.size,
    });
    if ("error" in presign) {
      setError(presign.error);
      setUploading(false);
      return;
    }

    const put = await fetch(presign.data.uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
    if (!put.ok) {
      setError("Upload failed. Please try again.");
      setUploading(false);
      return;
    }

    const confirmed = await confirmPaymentProofAction(orderNumber, {
      objectKey: presign.data.objectKey,
      mime: file.type,
      sizeBytes: file.size,
    });
    if ("error" in confirmed) {
      setError(confirmed.error);
      setUploading(false);
      return;
    }

    router.refresh();
    setUploading(false);
  }

  return (
    <div className="rounded-2xl border border-outline-variant/60 bg-surface-container p-5">
      <p className="mb-3 text-sm text-on-surface-variant">{hint}</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <Button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}>
        <Upload size={16} />
        {uploading ? "Uploading…" : "Upload InstaPay screenshot"}
      </Button>
      {error && <p className="mt-2 text-sm text-error">{error}</p>}
    </div>
  );
}
