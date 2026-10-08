"use client";

import { LayoutDashboard, Users, FileBarChart } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/manage", label: "Manage Users", icon: Users },
  { href: "/admin/reports", label: "Reports", icon: FileBarChart },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell links={links} roleLabel="Administrator">
      {children}
    </DashboardShell>
  );
}
