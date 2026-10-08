import { Skeleton } from "@/components/ui/skeleton";

export default function AdminReportsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />
      <div className="flex gap-3">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-10 w-48" />
      </div>
      <Skeleton className="h-96" />
    </div>
  );
}
