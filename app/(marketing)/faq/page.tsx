import type { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about donating blood and using LifeDrop.",
};

const FAQS = [
  {
    q: "Who can donate blood?",
    a: "Generally, healthy adults aged 18–60 weighing at least 50kg, with a hemoglobin level above the minimum threshold, can donate. Your district's blood bank or hospital will do a quick screening before every donation.",
  },
  {
    q: "How often can I donate?",
    a: "Whole blood donation is typically spaced at least 90 days (3 months) apart. LifeDrop tracks your last donation date and pauses your availability automatically after a logged donation.",
  },
  {
    q: "How does LifeDrop match me to a request?",
    a: "Requesters post their needed blood group and district. As a donor, you can filter pending requests by your own blood group and district, and match yourself to the ones you can fulfill.",
  },
  {
    q: "Is my contact information shared publicly?",
    a: "No. Your phone and contact details are only visible to a requester once you've matched yourself to their specific request, or to an admin managing the platform.",
  },
  {
    q: "What does the priority processing fee cover?",
    a: "Requesters can optionally pay a small SSLCommerz-processed fee to have an admin manually verify and prioritize an urgent request. It's entirely optional — free requests are still visible to all matching donors.",
  },
  {
    q: "Can I cancel a request I posted?",
    a: "Yes, as long as it hasn't been fulfilled yet. You can delete a pending or matched request from your dashboard at any time.",
  },
];

export default function FaqPage() {
  return (
    <div className="container-page py-16">
      <h1 className="text-3xl font-bold">Frequently asked questions</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Answers to what people usually ask before donating or requesting
        blood through LifeDrop.
      </p>

      <div className="mt-10 space-y-4">
        {FAQS.map((item) => (
          <Card key={item.q} className="p-6">
            <h3 className="font-semibold">{item.q}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.a}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
