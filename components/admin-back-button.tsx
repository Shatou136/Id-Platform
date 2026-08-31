"use client";

import { usePathname, useRouter } from "next/navigation";

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

function BackChevron() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M10 3.5 5.5 8 10 12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const defaultClassName =
  "inline-flex min-h-11 items-center gap-1.5 text-[13px] font-medium text-foreground hover:text-accent";

export function AdminBackButton({
  fallback,
  label = "Back",
  className = defaultClassName,
}: {
  fallback?: string;
  label?: string;
  className?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const path = pathname ?? "";
  const href = fallback ?? parentHref(path) ?? STAFF_HOME;

  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        if (typeof window !== "undefined" && window.history.length > 1) {
          router.back();
          return;
        }
        router.push(href);
      }}
    >
      <BackChevron />
      {label}
    </button>
  );
}

export function StaffHeaderBack() {
  const pathname = usePathname();
  if (!parentHref(pathname ?? "")) return null;
  return <AdminBackButton />;
}
