"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db, users, customers, roles, userRoles, carts, cartItems } from "@hamid/db";
import { loginSchema, registerSchema } from "@hamid/core";
import { auth, signIn, signOut } from "@/auth";
import { getGuestCartToken, clearGuestCartCookie } from "@/lib/cart/guest-token";
import { enforceRateLimit } from "@/lib/rate-limit";
import { sendVerificationEmail } from "./email-verification";
import type { ActionResult } from "./rbac";

export async function loginAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };

  // 10 attempts / 10 min per IP+email — blunts credential-stuffing / brute force
  // without locking out a user who just mistypes their password a few times.
  const limited = await enforceRateLimit("login", 10, 10 * 60 * 1000, parsed.data.email);
  if (!limited.ok) return { error: limited.error };

  const result = await signIn("credentials", { ...parsed.data, redirect: false });
  if (result?.error) return { error: "Invalid email or password." };

  await mergeGuestCartIntoUser();

  const callbackUrl = typeof raw.callbackUrl === "string" && raw.callbackUrl ? raw.callbackUrl : "/";
  redirect(callbackUrl);
}

export async function registerAction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const raw = Object.fromEntries(formData);
  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  const { fullName, email, phone, password } = parsed.data;

  // 5 accounts / hour per IP — registration abuse is lower-frequency by nature.
  const limited = await enforceRateLimit("register", 5, 60 * 60 * 1000);
  if (!limited.ok) return { error: limited.error };

  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) return { error: "An account with this email already exists." };

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db
    .insert(users)
    .values({ email, phone, fullName, passwordHash, status: "active", emailVerifiedAt: null })
    .$returningId();
  await db.insert(customers).values({ userId: user.id });

  const [customerRole] = await db.select({ id: roles.id }).from(roles).where(eq(roles.slug, "customer")).limit(1);
  if (customerRole) {
    await db.insert(userRoles).values({ userId: user.id, roleId: customerRole.id });
  }

  await sendVerificationEmail(user.id, email, fullName);

  const result = await signIn("credentials", { email, password, redirect: false });
  if (result?.error) return { error: "Account created — please sign in." };

  await mergeGuestCartIntoUser();
  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirectTo: "/" });
}

/** Re-parents any items from the anonymous guest cart onto the now-authenticated user's cart. */
async function mergeGuestCartIntoUser() {
  const session = await auth();
  const guestToken = await getGuestCartToken();
  if (!session?.user || !guestToken) return;

  const userId = Number(session.user.id);

  const [guestCart] = await db
    .select()
    .from(carts)
    .where(eq(carts.guestToken, guestToken))
    .limit(1);
  if (!guestCart) return;

  const [userCart] = await db.select().from(carts).where(eq(carts.userId, userId)).limit(1);

  if (!userCart) {
    await db.update(carts).set({ userId, guestToken: null }).where(eq(carts.id, guestCart.id));
  } else {
    const guestItems = await db.select().from(cartItems).where(eq(cartItems.cartId, guestCart.id));
    for (const item of guestItems) {
      const [existingLine] = await db
        .select()
        .from(cartItems)
        .where(eq(cartItems.cartId, userCart.id))
        .limit(1);
      const matching = existingLine && existingLine.storeProductId === item.storeProductId ? existingLine : null;
      if (matching) {
        await db
          .update(cartItems)
          .set({ quantity: matching.quantity + item.quantity })
          .where(eq(cartItems.id, matching.id));
      } else {
        await db.insert(cartItems).values({
          cartId: userCart.id,
          storeProductId: item.storeProductId,
          quantity: item.quantity,
          unitPriceSnapshot: item.unitPriceSnapshot,
          notes: item.notes,
        });
      }
    }
    await db.delete(carts).where(eq(carts.id, guestCart.id));
  }

  await clearGuestCartCookie();
}
