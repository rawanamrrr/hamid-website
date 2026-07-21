import Link from "next/link";
import { and, asc, eq } from "drizzle-orm";
import { Plus, Pencil } from "lucide-react";
import { db, storeCategories, storeCategoryTranslations } from "@hamid/db";
import { Button } from "@/components/ui/button";
import { Table, Thead, Th, Tr, Td, EmptyRow } from "@/components/admin/table";
import { SectionTabs } from "@/components/admin/section-tabs";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteStoreCategoryAction } from "@/lib/store/actions";

export default async function AdminStoreCategoriesPage() {
  const rows = await db
    .select({
      id: storeCategories.id,
      slug: storeCategories.slug,
      sortOrder: storeCategories.sortOrder,
      isActive: storeCategories.isActive,
      name: storeCategoryTranslations.name,
    })
    .from(storeCategories)
    .leftJoin(storeCategoryTranslations, and(eq(storeCategoryTranslations.categoryId, storeCategories.id), eq(storeCategoryTranslations.locale, "en")))
    .orderBy(asc(storeCategories.sortOrder));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-on-surface">Store</h1>
        <Button asChild>
          <Link href="/admin/store/categories/new">
            <Plus size={16} /> New category
          </Link>
        </Button>
      </div>

      <SectionTabs
        tabs={[
          { label: "Categories", href: "/admin/store" },
          { label: "Products", href: "/admin/store/products" },
          { label: "Hero Images", href: "/admin/store/hero" },
        ]}
      />

      <Table>
        <Thead>
          <tr>
            <Th>Name</Th>
            <Th>Slug</Th>
            <Th>Order</Th>
            <Th>Status</Th>
            <Th className="text-end">Actions</Th>
          </tr>
        </Thead>
        <tbody>
          {rows.map((c) => (
            <Tr key={c.id}>
              <Td className="font-medium">{c.name ?? "—"}</Td>
              <Td className="text-on-surface-variant">{c.slug}</Td>
              <Td className="text-on-surface-variant">{c.sortOrder}</Td>
              <Td>
                <span
                  className={
                    c.isActive
                      ? "rounded-full bg-secondary-container px-2 py-0.5 text-xs text-on-secondary-container"
                      : "rounded-full bg-surface-container-high px-2 py-0.5 text-xs text-on-surface-variant"
                  }
                >
                  {c.isActive ? "Active" : "Inactive"}
                </span>
              </Td>
              <Td className="text-end">
                <div className="flex items-center justify-end gap-3">
                  <Link href={`/admin/store/categories/${c.id}/edit`} className="text-on-surface-variant hover:text-primary">
                    <Pencil size={16} />
                  </Link>
                  <DeleteButton action={deleteStoreCategoryAction.bind(null, c.id)} />
                </div>
              </Td>
            </Tr>
          ))}
          {rows.length === 0 && <EmptyRow colSpan={5}>No categories yet.</EmptyRow>}
        </tbody>
      </Table>
    </div>
  );
}
