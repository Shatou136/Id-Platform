"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SCHOOL } from "@/lib/school-identity";

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}

function SignInForm() {
  const router = useRouter();
  const nextPath = useSearchParams().get("next");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch("/api/sign-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = (await response.json()) as {
      error?: string;
      role?: "Student" | "Admin" | "Super Admin";
    };
    setBusy(false);
    if (!response.ok) {
      setError(data.error ?? "Could not sign in.");
      return;
    }
    const fallback = data.role === "Student" ? "/student" : "/admin";
    router.push(nextPath || fallback);
    router.refresh();
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-md pt-6">
        <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-[15px] leading-6 text-muted">
          Use the Email you signed up with for {SCHOOL.name} Student ID Cards. A
          staff Email on the Admin list opens the Admin desk. Any other Email
          is a Student.
        </p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-1 block text-[13px] font-medium">Email</span>
            <input
              className="w-full rounded-md border border-input-border bg-surface px-3 py-2 text-[15px] outline-none focus:border-accent"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[13px] font-medium">Password</span>
            <input
              className="w-full rounded-md border border-input-border bg-surface px-3 py-2 text-[15px] outline-none focus:border-accent"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
            />
          </label>
          {error ? (
            <p className="text-[14px] font-medium text-accent">{error}</p>
          ) : null}
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-md bg-accent px-4 py-2.5 text-[15px] font-semibold text-white disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
        <p className="mt-3 text-[13px] leading-5">
          <Link className="font-medium text-foreground hover:text-accent" href="/forgot-password">
            Forgot password?
          </Link>
        </p>
        <p className="mt-3 text-[13px] leading-5">
          Don&apos;t have an account?{" "}
          <Link
            className="font-medium text-foreground hover:text-accent"
            href={nextPath ? `/sign-up?next=${encodeURIComponent(nextPath)}` : "/sign-up"}
          >
            Sign up
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
