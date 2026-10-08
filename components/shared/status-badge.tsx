import { Badge } from "@/components/ui/badge";
import { RequestStatus } from "@/lib/types";

const CONFIG: Record<RequestStatus, { label: string; variant: "default" | "success" | "warning" | "danger" }> = {
  PENDING: { label: "Pending", variant: "warning" },
  MATCHED: { label: "Matched", variant: "default" },
  FULFILLED: { label: "Fulfilled", variant: "success" },
  EXPIRED: { label: "Expired", variant: "danger" },
  CANCELLED: { label: "Cancelled", variant: "danger" },
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  const config = CONFIG[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
