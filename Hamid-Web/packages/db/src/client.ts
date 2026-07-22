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
  // than 30s is killed server-side, and a pool that keeps many idle sockets
  // around hands out dead ones — the source of the intermittent "Failed
  // query" errors that connectionLimit:5 originally fixed. But 5 concurrent
  // connections turned out too tight the other direction: a single page like
  // the homepage fires ~7-8 independent parallel queries (Hero,
  // FeaturedProducts, Categories, BestSellers, Locations, Navbar, Footer —
  // each its own async server component), so most of them ended up queueing
  // for a free connection on every load, which is exactly the "everything
  // feels laggy" symptom. connectionLimit:10 gives enough headroom for that
  // burst while maxIdle stays low (so idle sockets still get recycled well
  // before the server's own 30s cutoff, same fix as before) and queueLimit
  // still leaves clear room under the host's 20-connection cap for a second
  // dev server or deploy.
  return mysql.createPool({
    uri: url ?? "mysql://placeholder:placeholder@localhost:3306/placeholder",
    connectionLimit: 10,
    maxIdle: 3,
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
