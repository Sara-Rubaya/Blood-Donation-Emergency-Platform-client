import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-5">
      <Card className="w-full max-w-md p-8 text-center">
        <XCircle className="mx-auto h-10 w-10 text-muted-foreground" />
        <h1 className="mt-4 text-lg font-semibold">Payment cancelled</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          No charge was made. Your request is still active — you can retry the
          priority fee any time from your payments page.
        </p>
        <Link href="/dashboard/payments">
          <Button variant="outline" className="mt-6">
            Back to payments
          </Button>
        </Link>
      </Card>
    </div>
  );
}
