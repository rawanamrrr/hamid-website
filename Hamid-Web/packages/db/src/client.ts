import "./env";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

declare global {
  // eslint-disable-next-line no-var
  var __hamidDbPoolV2: mysql.Pool | undefined;
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
  // Tuned for the site4now shared-hosting MySQL, which enforces
  // wait_timeout=30s and max_user_connections=20: any connection idle longer
  // than 30s is killed server-side, and a pool that keeps 10 idle sockets
  // (the old config) hands out dead ones — the source of the intermittent
  // "Failed query" errors. Recycle idle connections well before the server
  // does, and stay far under the per-user cap so a second dev server or
  // deploy doesn't exhaust it.
  return mysql.createPool({
    uri: url ?? "mysql://placeholder:placeholder@localhost:3306/placeholder",
    connectionLimit: 5,
    maxIdle: 2,
    idleTimeout: 15_000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10_000,
    connectTimeout: 8_000,
    queueLimit: 25,
    dateStrings: false,
  });
}

// Reuse the pool across Next.js hot-reloads in dev. (Key is versioned so a
// config change here takes effect on hot-reload instead of reusing a pool
// built with stale options.)
const pool = globalThis.__hamidDbPoolV2 ?? createPool();
if (process.env.NODE_ENV !== "production") {
  globalThis.__hamidDbPoolV2 = pool;
}

export const db = drizzle(pool, { schema, mode: "default" });
export type Database = typeof db;
