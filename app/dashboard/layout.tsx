"use client";

import { ClipboardList, PlusCircle, UserCircle, CreditCard } from "lucide-react";
import { DashboardShell } from "@/components/layout/dashboard-shell";

const links = [
  { href: "/dashboard", label: "My Requests", icon: ClipboardList },
  { href: "/dashboard/requests/new", label: "New Request", icon: PlusCircle },
  { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
  { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
];

export default function RequesterDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell links={links} roleLabel="Requester">
      {children}
    </DashboardShell>
  );
}
