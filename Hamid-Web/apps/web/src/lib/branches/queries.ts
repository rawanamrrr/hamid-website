import "server-only";
import { asc } from "drizzle-orm";
import { db, branchLocations } from "@hamid/db";

export interface BranchView {
  id: number;
  name: string;
  address: string | null;
  hours: string | null;
  mapUrl: string | null;
}

/** Shown wherever branches render if none are configured yet (or the DB is briefly unreachable). */
export const FALLBACK_BRANCH: BranchView = {
  id: 0,
  name: "Mansoura Branch",
  address: "Taksem Khattab, Mansoura",
  hours: "Open Daily",
  mapUrl: "https://maps.google.com/?q=Taksem+Khattab+Mansoura",
};

/** Branches configured in Admin → Branches — used by the homepage locations section, footer, and /branches page. */
export async function getBranches(): Promise<BranchView[]> {
  return db
    .select({ id: branchLocations.id, name: branchLocations.name, address: branchLocations.address, hours: branchLocations.hours, mapUrl: branchLocations.mapUrl })
    .from(branchLocations)
    .orderBy(asc(branchLocations.id));
}
