import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the LifeDrop team.",
};

export default function ContactPage() {
  return (
    <div className="container-page py-16">
      <h1 className="text-3xl font-bold">Contact us</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Questions about a request, a donation, or partnering your hospital
        with LifeDrop — reach out below.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-5">
        <Card className="p-6 md:col-span-3">
          <ContactForm />
        </Card>

        <div className="space-y-4 md:col-span-2">
          <Card className="flex items-start gap-3 p-5">
            <Mail className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">Email</p>
              <p className="text-sm text-muted-foreground">support@lifedrop.app</p>
            </div>
          </Card>
          <Card className="flex items-start gap-3 p-5">
            <Phone className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">Phone</p>
              <p className="text-sm text-muted-foreground">+880 1XXX-XXXXXX</p>
            </div>
          </Card>
          <Card className="flex items-start gap-3 p-5">
            <MapPin className="mt-0.5 h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-semibold">Based in</p>
              <p className="text-sm text-muted-foreground">Dhaka, Bangladesh</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
