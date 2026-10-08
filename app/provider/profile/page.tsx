"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useMyProfile, useUpdateProfile } from "@/lib/hooks/use-users";
import { getErrorMessage } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { BLOOD_GROUPS, BloodGroup, DISTRICTS, formatBloodGroup } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
  city: z.string().optional(),
  bloodGroup: z.string().optional(),
});

type ProfileInput = z.infer<typeof schema>;

export default function DonorProfilePage() {
  const { data: profile, isLoading } = useMyProfile();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileInput>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name,
        phone: profile.phone ?? "",
        city: profile.city ?? "",
        bloodGroup: profile.bloodGroup ?? "",
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: ProfileInput) => {
    updateProfile.mutate(
      { ...data, bloodGroup: (data.bloodGroup || undefined) as BloodGroup | undefined },
      {
        onSuccess: () => toast.success("Profile updated"),
        onError: (err) => toast.error(getErrorMessage(err)),
      }
    );
  };

  const toggleAvailability = () => {
    if (!profile) return;
    updateProfile.mutate(
      { isAvailable: !profile.isAvailable },
      {
        onSuccess: () =>
          toast.success(profile.isAvailable ? "You're now unavailable" : "You're now available"),
        onError: (err) => toast.error(getErrorMessage(err)),
      }
    );
  };

  if (isLoading || !profile) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 max-w-lg" />
        <Skeleton className="h-96 max-w-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile & availability</h1>
        <p className="text-sm text-muted-foreground">
          Control whether requesters and the match list can see you as available.
        </p>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Availability</CardTitle>
          <CardDescription>
            {profile.isAvailable
              ? "You're visible to matching blood requests."
              : "You're hidden from matching blood requests."}
            {profile.lastDonationAt && (
              <> Last donation: {formatDate(profile.lastDonationAt)}.</>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant={profile.isAvailable ? "outline" : "primary"}
            onClick={toggleAvailability}
            loading={updateProfile.isPending}
          >
            {profile.isAvailable ? "Mark myself unavailable" : "Mark myself available"}
          </Button>
        </CardContent>
      </Card>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Account details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input value={profile.email} disabled />
            </div>
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input id="name" {...register("name")} />
              {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register("phone")} placeholder="01XXXXXXXXX" />
              </div>
              <div>
                <Label htmlFor="bloodGroup">Blood group</Label>
                <Select id="bloodGroup" {...register("bloodGroup")}>
                  <option value="">Select group</option>
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {formatBloodGroup(bg)}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="city">District</Label>
              <Select id="city" {...register("city")}>
                <option value="">Select district</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </div>
            <Button type="submit" loading={updateProfile.isPending}>
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
