import Link from "next/link";
import { and, asc, eq } from "drizzle-orm";
import { Plus, Pencil } from "lucide-react";
import { db, menuCategories, menuCategoryTranslations } from "@hamid/db";
import { Button } from "@/components/ui/button";
import { Table, Thead, Th, Tr, Td, EmptyRow } from "@/components/admin/table";
import { SectionTabs } from "@/components/admin/section-tabs";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteMenuCategoryAction } from "@/lib/menu/actions";

export default async function AdminMenuCategoriesPage() {
  const rows = await db
    .select({
      id: menuCategories.id,
      slug: menuCategories.slug,
      icon: menuCategories.icon,
      sortOrder: menuCategories.sortOrder,
      isActive: menuCategories.isActive,
      name: menuCategoryTranslations.name,
    })
    .from(menuCategories)
    .leftJoin(
      menuCategoryTranslations,
      and(eq(menuCategoryTranslations.categoryId, menuCategories.id), eq(menuCategoryTranslations.locale, "en")),
    )
    .orderBy(asc(menuCategories.sortOrder));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-on-surface">Menu</h1>
        <Button asChild>
          <Link href="/admin/menu/categories/new">
            <Plus size={16} /> New category
          </Link>
        </Button>
      </div>

      <SectionTabs
        tabs={[
          { label: "Categories", href: "/admin/menu" },
          { label: "Items", href: "/admin/menu/items" },
          { label: "Hero Images", href: "/admin/menu/hero" },
        ]}
      />

      <Table>
        <Thead>
          <tr>
            <Th>Name</Th>
            <Th>Slug</Th>
            <Th>Icon</Th>
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
              <Td className="text-on-surface-variant">{c.icon}</Td>
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
                  <Link href={`/admin/menu/categories/${c.id}/edit`} className="text-on-surface-variant hover:text-primary">
                    <Pencil size={16} />
                  </Link>
                  <DeleteButton action={deleteMenuCategoryAction.bind(null, c.id)} />
                </div>
              </Td>
            </Tr>
          ))}
          {rows.length === 0 && <EmptyRow colSpan={6}>No categories yet.</EmptyRow>}
        </tbody>
      </Table>
    </div>
  );
}
