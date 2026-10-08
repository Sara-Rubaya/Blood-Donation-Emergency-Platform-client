import Link from "next/link";
import { Droplet } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="container-page grid gap-8 py-12 md:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Droplet className="h-4.5 w-4.5 text-white" fill="white" />
            </span>
            LifeDrop
          </Link>
          <p className="mt-3 text-sm text-muted-foreground">
            Connecting verified blood donors with patients who need them,
            district by district, in real time.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Platform</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/about" className="hover:text-foreground">About</Link></li>
            <li><Link href="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link href="/faq" className="hover:text-foreground">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Account</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/login" className="hover:text-foreground">Login</Link></li>
            <li><Link href="/register" className="hover:text-foreground">Register</Link></li>
            <li><Link href="/contact" className="hover:text-foreground">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold">Emergency</h4>
          <p className="mt-3 text-sm text-muted-foreground">
            In a life-threatening emergency, call your local hospital directly —
            this platform supplements, but never replaces, emergency medical services.
          </p>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} LifeDrop — Blood Donation & Emergency Platform.
      </div>
    </footer>
  );
}
