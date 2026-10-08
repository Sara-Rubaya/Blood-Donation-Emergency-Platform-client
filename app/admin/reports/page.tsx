"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import { FileBarChart } from "lucide-react";
import { useBloodRequests, useUpdateRequestStatus } from "@/lib/hooks/use-blood-requests";
import { useUrlState } from "@/lib/hooks/use-url-state";
import { usePagination } from "@/lib/hooks/use-pagination";
import { getErrorMessage } from "@/lib/api";
import { SearchInput } from "@/components/shared/search-input";
import { Select } from "@/components/ui/select";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { BloodRequest, RequestStatus, formatBloodGroup } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const STATUS_OPTIONS: RequestStatus[] = ["PENDING", "MATCHED", "FULFILLED", "EXPIRED", "CANCELLED"];

export default function AdminReportsPage() {
  const [search, setSearch] = useUrlState("q");
  const [status, setStatus] = useUrlState("status");

  const { data: requests, isLoading } = useBloodRequests({ status: status || undefined });
  const updateStatus = useUpdateRequestStatus();

  const filtered = useMemo(() => {
    return (requests ?? []).filter((r) => {
      const term = search.toLowerCase();
      return (
        !term ||
        r.patientName.toLowerCase().includes(term) ||
        r.hospitalName.toLowerCase().includes(term) ||
        r.city.toLowerCase().includes(term)
      );
    });
  }, [requests, search]);

  const { page, totalPages, paginated, setPage } = usePagination(filtered, 8);

  const handleStatusChange = (requestId: string, nextStatus: RequestStatus) => {
    updateStatus.mutate(
      { requestId, status: nextStatus },
      {
        onSuccess: () => toast.success("Status updated"),
        onError: (err) => toast.error(getErrorMessage(err)),
      }
    );
  };

  const columns: Column<BloodRequest>[] = [
    {
      header: "Patient",
      render: (r) => (
        <div>
          <p className="font-medium">{r.patientName}</p>
          <p className="text-xs text-muted-foreground">{r.hospitalName}</p>
        </div>
      ),
    },
    { header: "Group", render: (r) => formatBloodGroup(r.bloodGroup) },
    { header: "District", render: (r) => r.city },
    { header: "Needed by", render: (r) => formatDate(r.requiredBy) },
    { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      header: "Override",
      render: (r) => (
        <Select
          value={r.status}
          onChange={(e) => handleStatusChange(r.id, e.target.value as RequestStatus)}
          className="h-8 w-36 text-xs"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>
        <p className="text-sm text-muted-foreground">
          All blood requests on the platform — override a status directly if needed.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search patient, hospital, district..."
          className="sm:w-80"
        />
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="sm:w-48">
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading requests...</p>
      ) : paginated.length === 0 ? (
        <EmptyState icon={FileBarChart} title="No requests found" description="Adjust your filters and try again." />
      ) : (
        <div className="space-y-4">
          <DataTable columns={columns} rows={paginated} getRowKey={(r) => r.id} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
