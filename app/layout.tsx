import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { PwaInstallScript } from "@/components/pwa-install-script";
import { RegisterServiceWorker } from "@/components/register-service-worker";
import { ThemeScript } from "@/components/theme-script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Student ID Cards — St. Louis University Institute",
  description:
    "Request, check, Print, Arrival, and Pickup for SLUI Student ID Cards.",
  applicationName: "SLUI ID",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "SLUI ID",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#e30613",
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <PwaInstallScript />
        <ThemeScript />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SLUI ID" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body className="h-full min-h-full">
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}
