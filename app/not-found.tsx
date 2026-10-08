import Link from "next/link";
import { Droplet, MapPinOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-5 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15">
        <MapPinOff className="h-7 w-7 text-primary" />
      </span>
      <h1 className="mt-6 text-4xl font-bold">404</h1>
      <p className="mt-2 text-lg font-semibold">This page isn&apos;t anywhere on the map</p>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist, or may have moved.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/">
          <Button>
            <Droplet className="h-4 w-4" /> Back to home
          </Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline">Contact us</Button>
        </Link>
      </div>
    </div>
  );
}
