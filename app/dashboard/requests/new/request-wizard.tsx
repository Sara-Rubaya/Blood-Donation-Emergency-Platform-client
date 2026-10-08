"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useCreateBloodRequest } from "@/lib/hooks/use-blood-requests";
import { getErrorMessage } from "@/lib/api";
import { BLOOD_GROUPS, BloodGroup, DISTRICTS, URGENCY_LEVELS, formatBloodGroup } from "@/lib/types";
import { cn } from "@/lib/utils";

const schema = z.object({
  patientName: z.string().min(2, "Enter the patient's name"),
  bloodGroup: z.enum(BLOOD_GROUPS as [BloodGroup, ...BloodGroup[]], {
    errorMap: () => ({ message: "Select a blood group" }),
  }),
  unitsNeeded: z.coerce.number().int().positive("Enter at least 1 unit"),
  hospitalName: z.string().min(2, "Enter the hospital name"),
  city: z.string().min(1, "Select a district"),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  requiredBy: z.string().min(1, "Select a date"),
  notes: z.string().optional(),
});

type WizardInput = z.output<typeof schema>;
type WizardFormValues = z.input<typeof schema>;

const STEP_FIELDS: (keyof WizardInput)[][] = [
  ["patientName", "bloodGroup", "unitsNeeded"],
  ["hospitalName", "city", "urgency", "requiredBy"],
  ["notes"],
];

const STEP_LABELS = ["Patient details", "Hospital & timing", "Review & submit"];

export function RequestWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const createRequest = useCreateBloodRequest();

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<WizardFormValues, unknown, WizardInput>({
    resolver: zodResolver(schema),
    defaultValues: { urgency: "MEDIUM" },
  });

  const values = watch();

  const goNext = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEP_LABELS.length - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = (data: WizardInput) => {
    createRequest.mutate(data, {
      onSuccess: () => {
        toast.success("Request posted — matching donors can now see it");
        router.push("/dashboard");
      },
      onError: (err) => toast.error(getErrorMessage(err)),
    });
  };

  return (
    <Card className="mx-auto max-w-2xl p-6 sm:p-8">
      <div className="mb-8 flex items-center">
        {STEP_LABELS.map((label, i) => (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold",
                  i < step
                    ? "border-primary bg-primary text-white"
                    : i === step
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground"
                )}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
              </div>
              <span className="hidden text-xs text-muted-foreground sm:block">{label}</span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={cn("mx-2 h-px flex-1", i < step ? "bg-primary" : "bg-border")} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="patientName">Patient name</Label>
              <Input id="patientName" {...register("patientName")} placeholder="Full name" />
              {errors.patientName && (
                <p className="mt-1 text-xs text-danger">{errors.patientName.message}</p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="bloodGroup">Blood group needed</Label>
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
              <div>
                <Label htmlFor="unitsNeeded">Units needed</Label>
                <Input id="unitsNeeded" type="number" min={1} {...register("unitsNeeded")} />
                {errors.unitsNeeded && (
                  <p className="mt-1 text-xs text-danger">{errors.unitsNeeded.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="hospitalName">Hospital name</Label>
              <Input id="hospitalName" {...register("hospitalName")} placeholder="e.g. Dhaka Medical College Hospital" />
              {errors.hospitalName && (
                <p className="mt-1 text-xs text-danger">{errors.hospitalName.message}</p>
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
              <div>
                <Label htmlFor="urgency">Urgency</Label>
                <Select id="urgency" {...register("urgency")}>
                  {URGENCY_LEVELS.map((u) => (
                    <option key={u} value={u}>
                      {u.charAt(0) + u.slice(1).toLowerCase()}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="requiredBy">Needed by</Label>
              <Input id="requiredBy" type="date" {...register("requiredBy")} />
              {errors.requiredBy && (
                <p className="mt-1 text-xs text-danger">{errors.requiredBy.message}</p>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="notes">Additional notes (optional)</Label>
              <Textarea id="notes" rows={3} {...register("notes")} placeholder="Anything a donor should know" />
            </div>
            <div className="rounded-lg border border-border bg-muted p-4 text-sm">
              <p className="font-medium">Review</p>
              <dl className="mt-3 grid grid-cols-2 gap-y-2 text-muted-foreground">
                <dt>Patient</dt>
                <dd className="text-foreground">{values.patientName}</dd>
                <dt>Blood group</dt>
                <dd className="text-foreground">{formatBloodGroup(values.bloodGroup)}</dd>
                <dt>Units</dt>
                <dd className="text-foreground">{values.unitsNeeded}</dd>
                <dt>Hospital</dt>
                <dd className="text-foreground">{values.hospitalName}</dd>
                <dt>District</dt>
                <dd className="text-foreground">{values.city}</dd>
                <dt>Needed by</dt>
                <dd className="text-foreground">{values.requiredBy}</dd>
              </dl>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-2">
          <Button type="button" variant="outline" onClick={goBack} disabled={step === 0}>
            <ChevronLeft className="h-4 w-4" /> Back
          </Button>
          {step < STEP_LABELS.length - 1 ? (
            <Button type="button" onClick={goNext}>
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" loading={createRequest.isPending}>
              Post request
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
