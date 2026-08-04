"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  FileText,
  Settings,
  LogOut,
  ExternalLink,
  Newspaper,
  Menu,
  Layout,
  BookOpen,
  Globe,
  Image as ImageIcon,
  ClipboardList,
  TrendingUp,
  Crosshair,
  LayoutPanelTop,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/pages", label: "Pages", icon: FileText },
  { href: "/admin/page-builder", label: "Page Builder", icon: LayoutPanelTop },
  { href: "/admin/posts", label: "Blog Posts", icon: Newspaper },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/case-studies", label: "Case Studies", icon: BookOpen },
  { href: "/admin/menus", label: "Menus", icon: Menu },
  { href: "/admin/hero", label: "Hero Sections", icon: Layout },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  { href: "/admin/forms", label: "Forms", icon: ClipboardList },
  { href: "/admin/optimization", label: "Optimization", icon: TrendingUp },
  { href: "/admin/competitors", label: "Competitors", icon: Crosshair },
  { href: "/admin/site-settings", label: "Site Settings", icon: Globe },
  { href: "/admin/settings", label: "Account", icon: Settings },
];

export function AdminSidebar({ userName, userRole }: { userName: string; userRole: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex items-center gap-2.5 border-b border-border px-5 py-4">
        <img src="/logo.png" alt="Gulf Seismic logo" className="h-9 w-auto object-contain" />
        <div className="leading-tight">
          <div className="font-bold text-sm">Gulf Seismic</div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Admin Panel
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-amber-brand text-amber-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User + actions */}
      <div className="border-t border-border p-3">
        <div className="mb-2 flex items-center gap-2 rounded-md bg-accent px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-medium">{userName}</div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
              {userRole}
            </div>
          </div>
        </div>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View Website
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
