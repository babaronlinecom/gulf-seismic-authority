import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const user = await db.adminUser.findUnique({
            where: { email: credentials.email.toLowerCase() },
          });
          if (!user) return null;
          const valid = await bcrypt.compare(
            credentials.password,
          user.passwordHash
          );
          if (!valid) return null;
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (err) {
          console.error("[auth] Authorize error:", err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 60 * 60 * 8 }, // 8 hours
  pages: { signIn: "/admin/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "editor";
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "gulf-seismic-dev-secret-change-in-production",
};

export type AdminRole = "admin" | "editor" | "viewer";
