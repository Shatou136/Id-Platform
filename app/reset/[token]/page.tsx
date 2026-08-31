"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";

export default function ResetPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const token = params.token;
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    void fetch("/api/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).then(async (response) => {
      const data = (await response.json()) as {
        error?: string;
        role?: "Student" | "Admin" | "Super Admin";
      };
      if (cancelled) return;
      if (!response.ok) {
        setError(data.error ?? "This reset link is not valid.");
        return;
      }
      const dest = data.role === "Student" ? "/student" : "/admin";
      router.replace(dest);
      router.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, [token, router]);

  const message = !token
    ? "This reset link is not valid."
    : error || "This reset link is signing you in.";
  const failed = Boolean(!token || error);

  return (
    <AppShell>
      <div className="mx-auto max-w-md pt-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {failed ? "Reset link" : "Signing in…"}
        </h1>
        <p className="mt-2 text-[15px] leading-6 text-muted">{message}</p>
        {failed ? (
          <Link
            href="/forgot-password"
            className="mt-6 inline-flex rounded-md bg-accent px-4 py-2.5 text-[15px] font-semibold text-white"
          >
            Ask for a new link
          </Link>
        ) : null}
      </div>
    </AppShell>
  );
}
