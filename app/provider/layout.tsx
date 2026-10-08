"use client";

import { HeartHandshake, TrendingUp, UserCircle } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

const links = [
  { href: "/provider", label: "Available Requests", icon: HeartHandshake },
  { href: "/provider/earnings", label: "My Impact", icon: TrendingUp },
  { href: "/provider/profile", label: "Profile", icon: UserCircle },
];

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell links={links} roleLabel="Donor">
      {children}
    </DashboardShell>
  );
}
