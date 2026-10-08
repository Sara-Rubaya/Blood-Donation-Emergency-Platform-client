"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreditCard, ShieldCheck } from "lucide-react";
import { useMyPayments, useInitiatePayment } from "@/lib/hooks/use-payments";
import { useBloodRequests } from "@/lib/hooks/use-blood-requests";
import { useAuthStore } from "@/lib/auth-store";
import { getErrorMessage } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/shared/data-table";
import { EmptyState } from "@/components/shared/empty-state";
import { Payment, formatBloodGroup } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

const PRIORITY_FEE = 150;

const PAYMENT_STATUS_VARIANT: Record<string, "default" | "success" | "warning" | "danger"> = {
  PENDING: "warning",
  SUCCESS: "success",
  FAILED: "danger",
  REFUNDED: "default",
};

export default function PaymentsPage() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id);
  const { data: requests } = useBloodRequests();
  const { data: payments, isLoading } = useMyPayments();
  const initiatePayment = useInitiatePayment();
  const [selectedRequest, setSelectedRequest] = useState("");

  const myPendingRequests = (requests ?? []).filter(
    (r) => r.requesterId === userId && r.status === "PENDING"
  );

  const handlePay = () => {
    if (!selectedRequest) {
      toast.error("Select a request first");
      return;
    }
    initiatePayment.mutate(
      { requestId: selectedRequest, purpose: "PRIORITY_LISTING" },
      {
        onSuccess: (data) => {
          // real gateway (Stripe) → hosted page; otherwise test-mode confirm page
          if (data.gatewayUrl) {
            window.location.href = data.gatewayUrl;
            return;
          }
          router.push(`/payment/success?tran_id=${data.transactionId}`);
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      }
    );
  };

  const columns: Column<Payment>[] = [
    { header: "Transaction ID", render: (p) => <span className="font-mono text-xs">{p.transactionId ?? "—"}</span> },
    { header: "Amount", render: (p) => `৳${p.amount}` },
    {
      header: "Status",
      render: (p) => <Badge variant={PAYMENT_STATUS_VARIANT[p.status]}>{p.status}</Badge>,
    },
    { header: "Date", render: (p) => formatDateTime(p.createdAt) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Payments</h1>
        <p className="text-sm text-muted-foreground">
          Pay an optional priority processing fee, or review your payment history.
        </p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Priority processing (test mode)</CardTitle>
          <CardDescription>
            ৳{PRIORITY_FEE} gets one of your pending requests manually reviewed and
            flagged for an admin. Entirely optional.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {myPendingRequests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              You don&apos;t have any pending requests to prioritize right now.
            </p>
          ) : (
            <>
              <Select value={selectedRequest} onChange={(e) => setSelectedRequest(e.target.value)}>
                <option value="">Select a pending request</option>
                {myPendingRequests.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.patientName} — {formatBloodGroup(r.bloodGroup)} @ {r.hospitalName}
                  </option>
                ))}
              </Select>
              <Button onClick={handlePay} loading={initiatePayment.isPending}>
                <CreditCard className="h-4 w-4" /> Pay ৳{PRIORITY_FEE}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Payment history</h2>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : !payments || payments.length === 0 ? (
          <EmptyState icon={ShieldCheck} title="No payments yet" description="Your payment history will show up here." />
        ) : (
          <DataTable columns={columns} rows={payments} getRowKey={(p) => p.id} />
        )}
      </div>
    </div>
  );
}
