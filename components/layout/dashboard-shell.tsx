"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Droplet, LogOut, type LucideIcon } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

export interface SidebarLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export function DashboardShell({
  links,
  roleLabel,
  children,
}: {
  links: SidebarLink[];
  roleLabel: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:flex md:flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-border px-5 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Droplet className="h-4.5 w-4.5 text-white" fill="white" />
          </span>
          LifeDrop
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <link.icon className="h-4.5 w-4.5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border p-4">
          <p className="truncate text-sm font-medium">{user?.name}</p>
          <p className="truncate text-xs text-muted-foreground">{roleLabel}</p>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-5 md:hidden">
          <span className="font-semibold">LifeDrop</span>
          <button onClick={handleLogout} className="text-sm text-muted-foreground">
            Logout
          </button>
        </header>
        <main className="flex-1 p-5 md:p-8">{children}</main>
      </div>
    </div>
  );
}
