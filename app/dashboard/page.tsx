"use client";

import Link from "next/link";
import { useMemo } from "react";
import { toast } from "sonner";
import { Siren, PlusCircle, XCircle, Droplets, Check, X } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import {
  useBloodRequests,
  useRespondToMatch,
  useUpdateRequestStatus,
} from "@/lib/hooks/use-blood-requests";
import { useUrlState } from "@/lib/hooks/use-url-state";
import { usePagination } from "@/lib/hooks/use-pagination";
import { getErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { DataTable, type Column } from "@/components/shared/data-table";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { BloodRequest, DonationMatch, RequestStatus, formatBloodGroup } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const STATUS_OPTIONS: RequestStatus[] = ["PENDING", "MATCHED", "FULFILLED", "EXPIRED", "CANCELLED"];

// A rejected volunteer no longer counts as "the donor" for this request
const activeMatch = (r: BloodRequest): DonationMatch | undefined =>
  r.matches?.find((m) => m.status !== "REJECTED");

export default function MyRequestsPage() {
  const userId = useAuthStore((s) => s.user?.id);
  const [status, setStatus] = useUrlState("status");

  const { data: requests, isLoading } = useBloodRequests({ status: status || undefined });
  const updateStatus = useUpdateRequestStatus();
  const respond = useRespondToMatch();

  const myRequests = useMemo(
    () => (requests ?? []).filter((r) => r.requesterId === userId),
    [requests, userId]
  );

  const { page, totalPages, paginated, setPage } = usePagination(myRequests, 6);

  // Postgres keeps history (donations/matches reference the request), so we cancel instead of deleting
  const handleCancel = (id: string) => {
    if (!confirm("Cancel this request?")) return;
    updateStatus.mutate(
      { requestId: id, status: "CANCELLED" },
      {
        onSuccess: () => toast.success("Request cancelled"),
        onError: (err) => toast.error(getErrorMessage(err)),
      }
    );
  };

  const handleRespond = (matchId: string, next: "ACCEPTED" | "REJECTED" | "COMPLETED") => {
    respond.mutate(
      { matchId, status: next },
      {
        onSuccess: () =>
          toast.success(
            next === "COMPLETED"
              ? "Marked as donated — thank you!"
              : next === "ACCEPTED"
              ? "Donor accepted"
              : "Donor declined"
          ),
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
    { header: "Units", render: (r) => r.unitsNeeded },
    { header: "Needed by", render: (r) => formatDate(r.requiredBy) },
    { header: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      header: "Donor",
      render: (r) => {
        const m = activeMatch(r);
        if (!m) return "—";
        return (
          <div>
            <p>{m.donor?.name ?? "Matched"}</p>
            {m.donor?.phone && <p className="text-xs text-muted-foreground">{m.donor.phone}</p>}
          </div>
        );
      },
    },
    {
      header: "Actions",
      render: (r) => {
        const m = activeMatch(r);
        const canCancel = r.status === "PENDING" || r.status === "MATCHED";
        return (
          <div className="flex gap-1">
            {r.status === "MATCHED" && m?.status === "PENDING" && (
              <>
                <Button size="sm" variant="outline" onClick={() => handleRespond(m.id, "ACCEPTED")}>
                  <Check className="h-4 w-4" /> Accept
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleRespond(m.id, "REJECTED")}>
                  <X className="h-4 w-4" /> Decline
                </Button>
              </>
            )}
            {r.status === "MATCHED" && m?.status === "ACCEPTED" && (
              <Button size="sm" variant="outline" onClick={() => handleRespond(m.id, "COMPLETED")}>
                <Droplets className="h-4 w-4" /> Mark donated
              </Button>
            )}
            {canCancel && (
              <Button
                size="sm"
                variant="ghost"
                className="text-danger hover:bg-danger/10"
                onClick={() => handleCancel(r.id)}
              >
                <XCircle className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">My requests</h1>
          <p className="text-sm text-muted-foreground">
            Track every blood request you&apos;ve posted.
          </p>
        </div>
        <Link href="/dashboard/requests/new">
          <Button>
            <PlusCircle className="h-4 w-4" /> New request
          </Button>
        </Link>
      </div>

      <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-48">
        <option value="">All statuses</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </Select>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading requests...</p>
      ) : paginated.length === 0 ? (
        <EmptyState
          icon={Siren}
          title="No requests yet"
          description="Post your first blood request to get matched with a donor."
          action={
            <Link href="/dashboard/requests/new">
              <Button>
                <PlusCircle className="h-4 w-4" /> New request
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          <DataTable columns={columns} rows={paginated} getRowKey={(r) => r.id} />
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
