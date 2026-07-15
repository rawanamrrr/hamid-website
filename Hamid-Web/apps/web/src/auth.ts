import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, users, userRoles, roles, rolePermissions, permissions } from "@hamid/db";
import { loginSchema } from "@hamid/core";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;

        const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
        if (!user || !user.passwordHash || user.status !== "active") return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        const roleRows = await db
          .select({ slug: roles.slug })
          .from(userRoles)
          .innerJoin(roles, eq(userRoles.roleId, roles.id))
          .where(eq(userRoles.userId, user.id));

        const permRows = await db
          .select({ slug: permissions.slug })
          .from(userRoles)
          .innerJoin(rolePermissions, eq(userRoles.roleId, rolePermissions.roleId))
          .innerJoin(permissions, eq(rolePermissions.permissionId, permissions.id))
          .where(eq(userRoles.userId, user.id));

        return {
          id: String(user.id),
          email: user.email,
          name: user.fullName,
          roles: roleRows.map((r) => r.slug),
          permissions: [...new Set(permRows.map((p) => p.slug))],
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id as string;
        token.roles = (user as { roles?: string[] }).roles ?? [];
        token.permissions = (user as { permissions?: string[] }).permissions ?? [];
      }
      return token;
    },
    async session({ session, token }) {
      // Cast sidesteps a next-auth v5 beta typing quirk where the session
      // callback's `token` param infers oddly under the database/jwt union.
      const t = token as { uid?: string; roles?: string[]; permissions?: string[] };
      if (session.user) {
        session.user.id = t.uid ?? "";
        session.user.roles = t.roles ?? [];
        session.user.permissions = t.permissions ?? [];
      }
      return session;
    },
  },
});
