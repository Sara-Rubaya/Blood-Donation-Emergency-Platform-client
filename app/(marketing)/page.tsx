import Link from "next/link";
import { ArrowRight, HeartHandshake, MapPin, ShieldCheck, Siren } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const STEPS = [
  {
    title: "Post or respond to a request",
    description:
      "A requester posts the patient's blood group, hospital and how many units are needed. Matching donors in that district get discoverable instantly.",
    icon: Siren,
  },
  {
    title: "A verified donor matches",
    description:
      "Registered donors browse pending requests in their blood group and district, then match themselves to the ones they can fulfill.",
    icon: HeartHandshake,
  },
  {
    title: "Donation is logged, donor rests",
    description:
      "Once the donation happens, the request is marked fulfilled and the donor's availability automatically pauses until they're eligible again.",
    icon: ShieldCheck,
  },
];

const COMPATIBILITY = [
  { group: "O-", gives: "All blood groups", receives: "O-" },
  { group: "O+", gives: "O+, A+, B+, AB+", receives: "O+, O-" },
  { group: "A-", gives: "A-, A+, AB-, AB+", receives: "A-, O-" },
  { group: "A+", gives: "A+, AB+", receives: "A+, A-, O+, O-" },
  { group: "B-", gives: "B-, B+, AB-, AB+", receives: "B-, O-" },
  { group: "B+", gives: "B+, AB+", receives: "B+, B-, O+, O-" },
  { group: "AB-", gives: "AB-, AB+", receives: "AB-, A-, B-, O-" },
  { group: "AB+", gives: "AB+", receives: "All blood groups" },
];

export default function HomePage() {
  return (
    <>
      <section className="border-b border-border">
        <div className="container-page grid gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> Matching donors by district, in real time
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl">
              A blood request shouldn&apos;t wait for luck to find a donor.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              LifeDrop connects hospitals and patients facing emergencies with
              verified, available donors nearby — no phone trees, no guesswork.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register">
                <Button size="lg">
                  Become a Donor <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Request Blood
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {STEPS.slice(0, 2).map((s) => (
              <Card key={s.title} className="p-5">
                <s.icon className="h-6 w-6 text-primary" />
                <p className="mt-3 text-sm font-semibold">{s.title}</p>
              </Card>
            ))}
            <Card className="col-span-2 p-5">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <p className="mt-3 text-sm font-semibold">{STEPS[2].title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{STEPS[2].description}</p>
            </Card>
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <h2 className="text-2xl font-semibold">How LifeDrop works</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <Card key={step.title} className="p-6">
              <span className="text-xs font-semibold text-primary">STEP {i + 1}</span>
              <h3 className="mt-2 text-base font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-card/40 py-16">
        <div className="container-page">
          <h2 className="text-2xl font-semibold">Blood group compatibility</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            A quick reference for which donor groups can give to, or receive from, each other.
          </p>
          <div className="mt-8 overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Blood group</th>
                  <th className="px-4 py-3">Can donate to</th>
                  <th className="px-4 py-3">Can receive from</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {COMPATIBILITY.map((row) => (
                  <tr key={row.group}>
                    <td className="px-4 py-3 font-semibold text-primary">{row.group}</td>
                    <td className="px-4 py-3">{row.gives}</td>
                    <td className="px-4 py-3">{row.receives}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="container-page py-16 text-center">
        <h2 className="text-2xl font-semibold">Ready to help, or need help?</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
          Register once — as a donor or a requester — and you&apos;re set up to act
          the moment it matters.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/register">
            <Button size="lg">Create an account</Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline">
              Talk to us
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
