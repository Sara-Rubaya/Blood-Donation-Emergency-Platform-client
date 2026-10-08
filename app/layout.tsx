import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import QueryProvider from "@/components/providers/query-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "LifeDrop — Blood Donation & Emergency Platform",
    template: "%s | LifeDrop",
  },
  description:
    "LifeDrop connects verified blood donors with patients and hospitals facing emergencies, in real time, district by district.",
  openGraph: {
    title: "LifeDrop — Blood Donation & Emergency Platform",
    description:
      "Connecting verified blood donors with patients who need them, district by district.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          {children}
          <Toaster theme="dark" position="top-right" richColors />
        </QueryProvider>
      </body>
    </html>
  );
}
