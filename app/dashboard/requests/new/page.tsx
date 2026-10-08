import { RequestWizard } from "./request-wizard";

export default function NewRequestPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Post a blood request</h1>
        <p className="text-sm text-muted-foreground">
          Three quick steps — matching donors will see this immediately.
        </p>
      </div>
      <RequestWizard />
    </div>
  );
}
