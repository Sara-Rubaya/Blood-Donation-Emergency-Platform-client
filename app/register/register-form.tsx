"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { useRegister } from "@/lib/hooks/use-auth";
import { getErrorMessage } from "@/lib/api";
import { BLOOD_GROUPS, BloodGroup, DISTRICTS, UserRole, formatBloodGroup } from "@/lib/types";

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["DONOR", "REQUESTER"]),
    bloodGroup: z
      .enum(BLOOD_GROUPS as [BloodGroup, ...BloodGroup[]])
      .optional()
      .or(z.literal("").transform(() => undefined)),
    phone: z.string().min(6, "Enter a valid phone number"),
    city: z.string().min(1, "Select a district"),
  })
  .refine((data) => data.role !== "DONOR" || !!data.bloodGroup, {
    message: "Blood group is required for donors",
    path: ["bloodGroup"],
  });

type RegisterFormValues = z.input<typeof schema>; // what the inputs hold ("" allowed)
type RegisterInput = z.output<typeof schema>; // validated payload

const ROLE_HOME: Record<UserRole, string> = {
  ADMIN: "/admin",
  DONOR: "/provider",
  REQUESTER: "/dashboard",
};

export function RegisterForm() {
  const router = useRouter();
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues, unknown, RegisterInput>({
    resolver: zodResolver(schema),
    defaultValues: { role: "REQUESTER" },
  });

  const role = watch("role");

  const onSubmit = (data: RegisterInput) => {
    registerMutation.mutate(
      {
        ...data,
        bloodGroup: data.role === "DONOR" ? data.bloodGroup : undefined,
      },
      {
        onSuccess: (res) => {
          toast.success(`Welcome to LifeDrop, ${res.user.name}!`);
          router.push(ROLE_HOME[res.user.role]);
        },
        onError: (err) => toast.error(getErrorMessage(err)),
      }
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label>I want to join as</Label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/10">
            <input type="radio" value="REQUESTER" {...register("role")} className="accent-primary" />
            Requester
          </label>
          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted px-3 py-2.5 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/10">
            <input type="radio" value="DONOR" {...register("role")} className="accent-primary" />
            Donor
          </label>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Full name</Label>
          <Input id="name" {...register("name")} placeholder="Your name" />
          {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register("phone")} placeholder="01XXXXXXXXX" />
          {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} placeholder="you@example.com" />
        {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")} placeholder="At least 6 characters" />
        {errors.password && (
          <p className="mt-1 text-xs text-danger">{errors.password.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="city">District</Label>
          <Select id="city" {...register("city")} defaultValue="">
            <option value="" disabled>
              Select district
            </option>
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
          {errors.city && (
            <p className="mt-1 text-xs text-danger">{errors.city.message}</p>
          )}
        </div>

        {role === "DONOR" && (
          <div>
            <Label htmlFor="bloodGroup">Blood group</Label>
            <Select id="bloodGroup" {...register("bloodGroup")} defaultValue="">
              <option value="" disabled>
                Select group
              </option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {formatBloodGroup(bg)}
                </option>
              ))}
            </Select>
            {errors.bloodGroup && (
              <p className="mt-1 text-xs text-danger">{errors.bloodGroup.message}</p>
            )}
          </div>
        )}
      </div>

      <Button type="submit" className="w-full" loading={registerMutation.isPending}>
        Create account
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
