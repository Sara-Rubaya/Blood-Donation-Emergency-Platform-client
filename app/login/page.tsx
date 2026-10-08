import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Droplet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Log in to your LifeDrop account.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-5">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Droplet className="h-5 w-5 text-white" fill="white" />
          </span>
          <span className="text-lg">LifeDrop</span>
        </Link>

        <Card className="p-8">
          <h1 className="text-xl font-semibold">Welcome back 👋</h1>
          <p className="mt-1 text-sm text-muted-foreground">Login to your account</p>
          <div className="mt-6">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
        </Card>
      </div>
    </div>
  );
}
