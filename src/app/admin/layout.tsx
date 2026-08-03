import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-session";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { SessionProvider } from "@/components/admin/session-provider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // Login page is the only admin route that doesn't require auth
  // (handled by the page itself). All others require a session.
  return (
    <SessionProvider session={session}>
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
