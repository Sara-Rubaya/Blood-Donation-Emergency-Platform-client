import type { Metadata } from "next";
import Link from "next/link";
import { Droplet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a LifeDrop account as a donor or a requester.",
};

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-5 py-12">
      <div className="w-full max-w-lg">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Droplet className="h-5 w-5 text-white" fill="white" />
          </span>
          <span className="text-lg">LifeDrop</span>
        </Link>

        <Card className="p-8">
          <h1 className="text-xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Join as a donor or post your first request
          </p>
          <div className="mt-6">
            <RegisterForm />
          </div>
        </Card>
      </div>
    </div>
  );
}
