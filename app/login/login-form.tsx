"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ShieldCheck, Droplet, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/lib/hooks/use-auth";
import { getErrorMessage } from "@/lib/api";
import { UserRole } from "@/lib/types";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginInput = z.infer<typeof schema>;

const ROLE_HOME: Record<UserRole, string> = {
  ADMIN: "/admin",
  DONOR: "/provider",
  REQUESTER: "/dashboard",
};

const DEMO_ACCOUNTS: {
  role: UserRole;
  label: string;
  email: string;
  password: string;
  icon: typeof ShieldCheck;
}[] = [
  {
    role: "ADMIN",
    label: "Admin",
    email: "admin@blooddonation.com",
    password: "Admin@123",
    icon: ShieldCheck,
  },
  {
    role: "REQUESTER",
    label: "Requester",
    email: "requester@blooddonation.com",
    password: "Requester@123",
    icon: Siren,
  },
  {
    role: "DONOR",
    label: "Donor",
    email: "donor@blooddonation.com",
    password: "Donor@123",
    icon: Droplet,
  },
];

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();
  const [demoLoading, setDemoLoading] = useState<UserRole | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({ resolver: zodResolver(schema) });

  const redirectAfterLogin = (role: UserRole) => {
    const from = searchParams.get("from");
    router.push(from || ROLE_HOME[role]);
  };

  const onSubmit = (data: LoginInput) => {
    login.mutate(data, {
      onSuccess: (res) => {
        toast.success(`Welcome back, ${res.user.name}`);
        redirectAfterLogin(res.user.role);
      },
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  const handleDemoLogin = (account: (typeof DEMO_ACCOUNTS)[number]) => {
    setDemoLoading(account.role);
    login.mutate(
      { email: account.email, password: account.password },
      {
        onSuccess: (res) => {
          toast.success(`Logged in as demo ${account.label}`);
          redirectAfterLogin(res.user.role);
        },
        onError: (err) =>
          toast.error(
            `${getErrorMessage(err)} — run the backend seed script to create demo accounts.`
          ),
        onSettled: () => setDemoLoading(null),
      }
    );
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} placeholder="you@example.com" />
          {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} placeholder="••••••••" />
          {errors.password && (
            <p className="mt-1 text-xs text-danger">{errors.password.message}</p>
          )}
        </div>
        <Button type="submit" className="w-full" loading={login.isPending}>
          🔐 Login
        </Button>
      </form>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs text-muted-foreground">OR</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <div>
        <p className="text-center text-sm font-medium">🚀 Quick Demo Login</p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {DEMO_ACCOUNTS.slice(0, 2).map((account) => (
            <Button
              key={account.role}
              type="button"
              variant="outline"
              loading={demoLoading === account.role}
              onClick={() => handleDemoLogin(account)}
            >
              <account.icon className="h-4 w-4" /> {account.label}
            </Button>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          className="mt-3 w-full"
          loading={demoLoading === "DONOR"}
          onClick={() => handleDemoLogin(DEMO_ACCOUNTS[2])}
        >
          <Droplet className="h-4 w-4" /> Donor
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
}
