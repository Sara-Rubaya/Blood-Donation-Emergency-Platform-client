import { Suspense } from "react";
import { PaymentSuccessContent } from "./success-content";

export default function PaymentSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-5">
      <Suspense fallback={null}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
