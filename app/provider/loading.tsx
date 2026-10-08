import { Skeleton } from "@/components/ui/skeleton";

export default function AvailableRequestsLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-56" />
      <div className="flex gap-3">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-10 w-56" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44" />
        ))}
      </div>
    </div>
  );
}
