"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { api, getErrorMessage } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const tranId = searchParams.get("tran_id");
  const [state, setState] = useState<"confirming" | "done" | "error">("confirming");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!tranId) {
      setState("error");
      setError("Missing transaction ID");
      return;
    }
    api
      .post("/payments/success", { tran_id: tranId })
      .then(() => setState("done"))
      .catch((err) => {
        setState("error");
        setError(getErrorMessage(err));
      });
  }, [tranId]);

  return (
    <Card className="w-full max-w-md p-8 text-center">
      {state === "confirming" && (
        <>
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <h1 className="mt-4 text-lg font-semibold">Confirming your payment...</h1>
        </>
      )}
      {state === "done" && (
        <>
          <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
          <h1 className="mt-4 text-lg font-semibold">Payment successful</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Transaction <span className="font-mono">{tranId}</span> confirmed. An admin
            will review your prioritized request shortly.
          </p>
          <Link href="/dashboard/payments">
            <Button className="mt-6">Back to payments</Button>
          </Link>
        </>
      )}
      {state === "error" && (
        <>
          <XCircle className="mx-auto h-10 w-10 text-danger" />
          <h1 className="mt-4 text-lg font-semibold">Couldn&apos;t confirm payment</h1>
          <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          <Link href="/dashboard/payments">
            <Button variant="outline" className="mt-6">
              Back to payments
            </Button>
          </Link>
        </>
      )}
    </Card>
  );
}
