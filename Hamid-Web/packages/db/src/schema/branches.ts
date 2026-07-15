import { boolean, char, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { id, timestamps, uuid } from "./_helpers";

/**
 * Reserved for multi-branch/POS. Seeded with a single branch for Phase 1,
 * but every operational table already carries branch_id so multi-branch
 * never requires a schema migration later.
 */
export const branches = mysqlTable("branches", {
  id: id(),
  uuid: uuid(),
  code: varchar("code", { length: 32 }).notNull().unique(),
  name: varchar("name", { length: 191 }).notNull(),
  address: varchar("address", { length: 255 }),
  phone: varchar("phone", { length: 32 }),
  timezone: varchar("timezone", { length: 64 }).notNull().default("Africa/Cairo"),
  currency: char("currency", { length: 3 }).notNull().default("EGP"),
  isActive: boolean("is_active").notNull().default(true),
  ...timestamps,
});
