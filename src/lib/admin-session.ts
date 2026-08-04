import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";
import type { AdminRole } from "./auth";

export interface AdminSession {
  user: {
    id: string;
    email: string;
    name: string;
    role: AdminRole;
  };
}

/** Get the current admin session (or null) in a server component. */
export async function getAdminSession(): Promise<AdminSession | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return session as unknown as AdminSession;
}

/** Require an authenticated admin — redirects to login if not. */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** Require a specific role (admin/editor). Viewers are read-only. */
export async function requireRole(roles: AdminRole[]): Promise<AdminSession> {
  const session = await requireAdmin();
  if (!roles.includes(session.user.role)) {
    redirect("/admin?error=insufficient-role");
  }
  return session;
}
