"use client";

import { useMemo } from "react";
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Droplets, Award } from "lucide-react";
import { useMyDonations } from "@/lib/hooks/use-donations";
import { StatCard } from "@/components/shared/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Donation } from "@/lib/hooks/use-donations";
import { formatDate } from "@/lib/utils";

export default function DonorImpactPage() {
  const { data: donations, isLoading } = useMyDonations();

  const totalUnits = useMemo(
    () => donations?.reduce((sum, d) => sum + d.unitsDonated, 0) ?? 0,
    [donations]
  );

  const chartData = useMemo(() => {
    return (donations ?? [])
      .slice()
      .reverse()
      .map((d, i) => ({
        label: `#${i + 1}`,
        units: d.unitsDonated,
      }));
  }, [donations]);

  const columns: Column<Donation>[] = [
    {
      header: "Patient",
      render: (d) => d.request?.patientName ?? "—",
    },
    { header: "Hospital", render: (d) => d.request?.hospitalName ?? "—" },
    { header: "District", render: (d) => d.request?.city ?? "—" },
    { header: "Units given", render: (d) => d.unitsDonated },
    { header: "Date", render: (d) => formatDate(d.donatedAt) },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">My impact</h1>
        <p className="text-sm text-muted-foreground">
          A record of every donation you&apos;ve logged through LifeDrop.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Total donations" value={donations?.length ?? 0} icon={Droplets} tone="primary" />
        <StatCard label="Total units given" value={totalUnits} icon={Award} tone="success" />
      </div>

      {donations && donations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Units per donation</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="label" stroke="#a1a1aa" fontSize={12} />
                <YAxis stroke="#a1a1aa" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: "#141417", border: "1px solid #27272a", borderRadius: 8 }}
                />
                <Line type="monotone" dataKey="units" stroke="#e11d2a" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {!donations || donations.length === 0 ? (
        <EmptyState
          icon={Droplets}
          title="No donations logged yet"
          description="Match yourself to a pending request to start your donation history."
        />
      ) : (
        <DataTable columns={columns} rows={donations} getRowKey={(d) => d.id} />
      )}
    </div>
  );
}
