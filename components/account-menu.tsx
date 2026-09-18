"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Role } from "@/lib/staff";

function initialsFromEmail(email: string) {
  const local = email.split("@")[0] ?? "?";
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return local.slice(0, 2).toUpperCase() || "?";
}

function AvatarMark({ email }: { email: string }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-white"
    >
      {initialsFromEmail(email)}
    </span>
  );
}

export function AccountMenu() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/me")
      .then((response) => response.json())
      .then((data: { session?: { email?: string; role?: Role } | null }) => {
        if (cancelled) return;
        setEmail(data.session?.email ?? null);
        setRole(data.session?.role ?? null);
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function signOut() {
    await fetch("/api/sign-out", { method: "POST" });
    router.push("/sign-in");
    router.refresh();
  }

  if (!loaded) {
    return <span className="size-9" aria-hidden="true" />;
  }

  if (!email || !role) {
    return (
      <Button variant="outline" size="sm" asChild>
        <Link href="/sign-in">Sign in</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Account menu"
          className="overflow-hidden rounded-full p-0"
        >
          <AvatarMark email={email} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center gap-3 px-2 py-2.5">
          <AvatarMark email={email} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold leading-5">{email}</p>
            <p className="truncate text-xs text-muted">{role}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => void signOut()}>
          <LogOut className="size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
