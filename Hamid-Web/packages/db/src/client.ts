import "./env";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var __hamidDbPool: mysql.Pool | undefined;
}

// mysql2 pools don't open a socket until the first query, so it's safe to
// create one even with a placeholder URL. Deliberately NOT throwing here:
// build tooling (e.g. `next build` collecting route metadata) imports route
// modules — which transitively import this file — without ever running a
// query, so an eager throw on a missing DATABASE_URL would break the build
// itself rather than surfacing at actual request time, where it belongs.
function createPool() {
  const url = process.env.DATABASE_URL;
  if (!url && process.env.NODE_ENV !== "test") {
    console.warn("DATABASE_URL is not set — using a placeholder. Copy .env.example to .env and configure it before making real requests.");
  }
  return mysql.createPool({
    uri: url ?? "mysql://placeholder:placeholder@localhost:3306/placeholder",
    connectionLimit: 10,
    dateStrings: false,
  });
}

// Reuse the pool across Next.js hot-reloads in dev.
const pool = globalThis.__hamidDbPool ?? createPool();
if (process.env.NODE_ENV !== "production") {
  globalThis.__hamidDbPool = pool;
}

export const db = drizzle(pool, { schema, mode: "default" });
export type Database = typeof db;
