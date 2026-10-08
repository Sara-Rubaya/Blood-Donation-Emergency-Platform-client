import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Siren, Search, ShieldCheck, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Services",
  description: "What LifeDrop offers requesters, donors and hospitals.",
};

const SERVICES = [
  {
    icon: Siren,
    title: "Emergency request posting",
    description:
      "Create a blood request with patient details, hospital, blood group, units needed and a deadline. It's visible to matching donors immediately.",
  },
  {
    icon: Search,
    title: "Donor search & matching",
    description:
      "Filter available donors by blood group and district, or let donors browse pending requests and match themselves.",
  },
  {
    icon: ShieldCheck,
    title: "Donation tracking",
    description:
      "Every request moves through Pending → Matched → Fulfilled, with the donation logged against the donor's history automatically.",
  },
  {
    icon: CreditCard,
    title: "Priority processing",
    description:
      "Requesters can pay a small verification fee via SSLCommerz to mark an emergency request as priority-reviewed by an admin.",
  },
];

export default function ServicesPage() {
  return (
    <div className="container-page py-16">
      <h1 className="text-3xl font-bold">Services</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Everything built around one goal: shortening the distance between a
        blood request and a matched donor.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {SERVICES.map((s) => (
          <Card key={s.title} className="p-6">
            <s.icon className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
          </Card>
        ))}
      </div>

      <div className="mt-12 flex gap-3">
        <Link href="/register">
          <Button size="lg">Get started</Button>
        </Link>
        <Link href="/contact">
          <Button size="lg" variant="outline">
            Ask a question
          </Button>
        </Link>
      </div>
    </div>
  );
}
