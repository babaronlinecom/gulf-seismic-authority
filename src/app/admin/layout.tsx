import type { Metadata } from "next";
import { getAdminSession } from "@/lib/admin-session";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SessionProvider } from "@/components/admin/session-provider";
import type { Session } from "next-auth";

// Admin pages should NEVER be indexed by search engines
export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Admin — Gulf Seismic",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  const nextAuthSession: Session | null = session as unknown as Session | null;

  return (
    <SessionProvider session={nextAuthSession}>
      <div className="flex min-h-screen bg-background">
        {session ? (
          <AdminSidebar
            userName={session.user.name}
            userRole={session.user.role}
          />
        ) : null}
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
