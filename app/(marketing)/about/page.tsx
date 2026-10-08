import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Users, Target, Eye } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description: "Why LifeDrop exists and how it approaches blood donation matching.",
};

export default function AboutPage() {
  return (
    <div className="container-page py-16">
      <h1 className="text-3xl font-bold">About LifeDrop</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Most urgent blood requests are still resolved through word of mouth —
        a family member posting in a Facebook group, calling relatives,
        hoping someone with the right blood group sees it in time. LifeDrop
        exists to replace that scramble with a structured, searchable system:
        requesters post what they need, donors who match get to see it
        immediately, and the whole exchange is tracked from request to
        fulfilled donation.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <Target className="h-6 w-6 text-primary" />
          <h3 className="mt-3 font-semibold">Our mission</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Cut the time between "we need blood" and "a donor is on the way"
            down to minutes, not hours.
          </p>
        </Card>
        <Card className="p-6">
          <Eye className="h-6 w-6 text-primary" />
          <h3 className="mt-3 font-semibold">Our approach</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            District-level matching, blood-group filtering, and a donor
            availability toggle so no one gets contacted when they can&apos;t
            give.
          </p>
        </Card>
        <Card className="p-6">
          <Users className="h-6 w-6 text-primary" />
          <h3 className="mt-3 font-semibold">Who it&apos;s for</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Patients&apos; families, hospital liaisons, and the donors who want
            to be found when it matters, not buried in group chats.
          </p>
        </Card>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="font-semibold">Requesters</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Post a patient&apos;s blood need with hospital, district and
            urgency — track it until it&apos;s fulfilled.
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold">Donors</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Set your blood group, district and availability — match yourself
            to requests you can actually help with.
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold">Admins</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Oversee every request and account on the platform, step in where
            needed, and keep the system trustworthy.
          </p>
        </Card>
      </div>
    </div>
  );
}
