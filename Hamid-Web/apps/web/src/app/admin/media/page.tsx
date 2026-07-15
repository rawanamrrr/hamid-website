import { desc } from "drizzle-orm";
import { db, media } from "@hamid/db";
import { MediaLibrary } from "@/components/admin/media/media-library";

export default async function AdminMediaPage() {
  const rows = await db.select().from(media).orderBy(desc(media.createdAt)).limit(100);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-on-surface">Media Library</h1>
      <p className="mt-1 text-sm text-on-surface-variant">
        Upload images for the menu, store, and homepage. Files are stored in MinIO.
      </p>

      <div className="mt-6">
        <MediaLibrary
          initialItems={rows.map((r) => ({
            id: r.id,
            url: r.isPrivate ? null : r.url,
            alt: r.alt,
            title: r.title,
            isPrivate: r.isPrivate,
            mime: r.mime,
          }))}
        />
      </div>
    </div>
  );
}
