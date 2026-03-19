import type { Metadata } from "next";
import { Suspense } from "react";

import { AppShell } from "@/components/layout/app-shell";

import "./globals.css";

export const metadata: Metadata = {
  title: "Responsive Medical Knowledge Platform",
  description:
    "Visually faithful Next.js recreation of the Figma medical knowledge frontend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Suspense
          fallback={
            <div className="min-h-screen bg-background text-foreground">
              {children}
            </div>
          }
        >
          <AppShell>{children}</AppShell>
        </Suspense>
      </body>
    </html>
  );
}
