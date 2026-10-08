"use client";

import { toast } from "sonner";
import { HeartHandshake, MapPin, Droplet } from "lucide-react";
import { useMyProfile } from "@/lib/hooks/use-users";
import { useBloodRequests, useVolunteer } from "@/lib/hooks/use-blood-requests";
import { useUrlState } from "@/lib/hooks/use-url-state";
import { usePagination } from "@/lib/hooks/use-pagination";
import { getErrorMessage } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/shared/pagination";
import { EmptyState } from "@/components/shared/empty-state";
import { DISTRICTS, formatBloodGroup } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function AvailableRequestsPage() {
  const { data: profile } = useMyProfile();
  const [city, setCity] = useUrlState("city");
  const [onlyMine, setOnlyMine] = useUrlState("group");

  const { data: requests, isLoading } = useBloodRequests({
    status: "PENDING",
    city: city || undefined,
    bloodGroup: onlyMine === "match" ? profile?.bloodGroup ?? undefined : undefined,
  });
  const volunteer = useVolunteer();

  const { page, totalPages, paginated, setPage } = usePagination(requests ?? [], 6);

  const handleMatch = (id: string) => {
    if (!profile?.isAvailable) {
      toast.error("Turn on your availability in Profile before matching a request");
      return;
    }
    volunteer.mutate(id, {
      onSuccess: () => toast.success("You're matched! The requester can now see your contact info."),
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Available requests</h1>
        <p className="text-sm text-muted-foreground">
          Pending requests near you — match yourself to the ones you can fulfill.
        </p>
      </div>

      {profile && !profile.isAvailable && (
        <Card className="border-warning/40 bg-warning/10 p-4 text-sm">
          You&apos;re marked unavailable right now, so requesters won&apos;t see you as a
          match option. Toggle availability from your{" "}
          <a href="/provider/profile" className="font-medium underline">
            profile
          </a>
          .
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Select value={city} onChange={(e) => setCity(e.target.value)} className="sm:w-56">
          <option value="">All districts</option>
          {DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Select>
        <Select value={onlyMine} onChange={(e) => setOnlyMine(e.target.value)} className="sm:w-56">
          <option value="">All blood groups</option>
          <option value="match">My blood group only ({formatBloodGroup(profile?.bloodGroup)})</option>
        </Select>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading requests...</p>
      ) : paginated.length === 0 ? (
        <EmptyState
          icon={HeartHandshake}
          title="No pending requests"
          description="Nothing matches your filters right now — check back soon."
        />
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((r) => (
              <Card key={r.id} className="flex flex-col p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold">{r.patientName}</p>
                    <p className="text-xs text-muted-foreground">{r.hospitalName}</p>
                  </div>
                  <Badge className="shrink-0">
                    <Droplet className="mr-1 h-3 w-3" /> {formatBloodGroup(r.bloodGroup)}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {r.city}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {r.unitsNeeded} unit(s) needed by {formatDate(r.requiredBy)}
                </p>
                <div className="mt-auto pt-4">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleMatch(r.id)}
                    loading={volunteer.isPending && volunteer.variables === r.id}
                  >
                    <HeartHandshake className="h-4 w-4" /> Match this request
                  </Button>
                </div>
              </Card>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
