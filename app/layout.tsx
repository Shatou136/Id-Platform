import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ThemeScript } from "@/components/theme-script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student ID Cards — St. Louis University Institute",
  description:
    "Request, check, Print, Arrival, and Pickup for SLUI Student ID Cards.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "SLUI ID",
    statusBarStyle: "default",
  },
  icons: {
    apple: "/logo.jpg",
  },
};

export const viewport: Viewport = {
  themeColor: "#e30613",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
