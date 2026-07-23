import type { Metadata } from "next";
import { DM_Sans, Fira_Mono } from "next/font/google";
import "./globals.css";

// Aligned with ucp-dhilaunch: DM Sans (variable) + Fira Mono.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

const firaMono = Fira_Mono({
  variable: "--font-fira-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Docker Hub — Image management · hub-ui",
  description:
    "A UX prototype for repository storage cleanup: review suggested cleanup, audit digests, and safely reclaim storage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${firaMono.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
