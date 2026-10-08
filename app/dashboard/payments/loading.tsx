import { Skeleton } from "@/components/ui/skeleton";

export default function PaymentsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="h-56 max-w-lg" />
      <Skeleton className="h-64" />
    </div>
  );
}
