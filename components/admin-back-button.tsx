"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

const STAFF_HOME = "/admin";

function parentHref(pathname: string): string | null {
  if (pathname === STAFF_HOME) return null;
  if (
    pathname.startsWith("/admin/") ||
    pathname === "/settings" ||
    pathname.startsWith("/settings/") ||
    pathname === "/print" ||
    pathname.startsWith("/print/")
  ) {
    return STAFF_HOME;
  }
  return null;
}

export function AdminBackButton({
  fallback,
  label = "Back",
}: {
  fallback?: string;
  label?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const path = pathname ?? "";
  const href = fallback ?? parentHref(path) ?? STAFF_HOME;

  return (
    <Button
      type="button"
      variant="outline"
      size="default"
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
          return;
        }
        router.push(href);
      }}
    >
      <ChevronLeft />
      {label}
    </Button>
  );
}

export function StaffBackBar() {
  const pathname = usePathname();
  if (!parentHref(pathname ?? "")) return null;
  return (
    <div className="border-b border-line bg-background">
      <div className="mx-auto flex w-full max-w-6xl px-4 py-3">
        <AdminBackButton />
      </div>
    </div>
  );
}
