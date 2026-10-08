"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Users, Droplet, Siren, CheckCircle2 } from "lucide-react";
import { useAllUsers } from "@/lib/hooks/use-users";
import { useBloodRequests } from "@/lib/hooks/use-blood-requests";
import { formatBloodGroup } from "@/lib/types";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#eab308",
  MATCHED: "#e11d2a",
  FULFILLED: "#22c55e",
  EXPIRED: "#f97316",
  CANCELLED: "#71717a",
};

export default function AdminOverviewPage() {
  const { data: users, isLoading: usersLoading } = useAllUsers();
  const { data: requests, isLoading: requestsLoading } = useBloodRequests();

  const stats = useMemo(() => {
    const donors = users?.filter((u) => u.role === "DONOR").length ?? 0;
    const requesters = users?.filter((u) => u.role === "REQUESTER").length ?? 0;
    const admins = users?.filter((u) => u.role === "ADMIN").length ?? 0;
    const fulfilled = requests?.filter((r) => r.status === "FULFILLED").length ?? 0;
    const pending = requests?.filter((r) => r.status === "PENDING").length ?? 0;
    return { donors, requesters, admins, fulfilled, pending };
  }, [users, requests]);

  const bloodGroupData = useMemo(() => {
    const counts: Record<string, number> = {};
    requests?.forEach((r) => {
      const label = formatBloodGroup(r.bloodGroup);
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts).map(([group, count]) => ({ group, count }));
  }, [requests]);

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    requests?.forEach((r) => {
      counts[r.status] = (counts[r.status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, value]) => ({ status, value }));
  }, [requests]);

  const loading = usersLoading || requestsLoading;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-80" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Overview</h1>
        <p className="text-sm text-muted-foreground">
          Live snapshot of the platform&apos;s users and blood requests.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Donors" value={stats.donors} icon={Droplet} tone="primary" />
        <StatCard label="Requesters" value={stats.requesters} icon={Users} tone="default" />
        <StatCard label="Pending requests" value={stats.pending} icon={Siren} tone="warning" />
        <StatCard label="Fulfilled requests" value={stats.fulfilled} icon={CheckCircle2} tone="success" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Requests by blood group</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {bloodGroupData.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No requests yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bloodGroupData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="group" stroke="#a1a1aa" fontSize={12} />
                  <YAxis stroke="#a1a1aa" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: "#141417", border: "1px solid #27272a", borderRadius: 8 }}
                  />
                  <Bar dataKey="count" fill="#e11d2a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requests by status</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            {statusData.length === 0 ? (
              <p className="flex h-full items-center justify-center text-sm text-muted-foreground">
                No requests yet
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="status" innerRadius={60} outerRadius={90}>
                    {statusData.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#141417", border: "1px solid #27272a", borderRadius: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
