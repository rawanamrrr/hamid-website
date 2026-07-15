import { desc, eq } from "drizzle-orm";
import { db, activityLogs, users } from "@hamid/db";
import { Table, Thead, Th, Tr, Td, EmptyRow } from "@/components/admin/table";

export default async function AdminActivityPage() {
  const rows = await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      entityType: activityLogs.entityType,
      entityId: activityLogs.entityId,
      createdAt: activityLogs.createdAt,
      actorName: users.fullName,
    })
    .from(activityLogs)
    .leftJoin(users, eq(users.id, activityLogs.actorUserId))
    .orderBy(desc(activityLogs.createdAt))
    .limit(200);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-on-surface">Activity Logs</h1>
      <p className="mt-1 text-sm text-on-surface-variant">
        A record of admin actions across the dashboard.
      </p>

      <div className="mt-6">
        <Table>
          <Thead>
            <tr>
              <Th>When</Th>
              <Th>Actor</Th>
              <Th>Action</Th>
              <Th>Entity</Th>
            </tr>
          </Thead>
          <tbody>
            {rows.map((r) => (
              <Tr key={r.id}>
                <Td className="text-on-surface-variant">{new Date(r.createdAt).toLocaleString()}</Td>
                <Td>{r.actorName ?? "System"}</Td>
                <Td className="font-medium">{r.action}</Td>
                <Td className="text-on-surface-variant">
                  {r.entityType}
                  {r.entityId ? ` #${r.entityId}` : ""}
                </Td>
              </Tr>
            ))}
            {rows.length === 0 && <EmptyRow colSpan={4}>No activity recorded yet.</EmptyRow>}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
