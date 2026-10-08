import { Skeleton } from "@/components/ui/skeleton";

export default function MyRequestsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-80" />
    </div>
  );
}
