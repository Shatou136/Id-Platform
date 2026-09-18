"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SCHOOL } from "@/lib/school-identity";

export default function SignUpPage() {
  return (
    <Suspense>
      <SignUpForm />
    </Suspense>
  );
}

function SignUpForm() {
  const router = useRouter();
  const nextPath = useSearchParams().get("next");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  function clientError() {
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 2) return "Enter your full name.";
    if (!email.trim() || !email.includes("@")) return "Enter a valid Email.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return "";
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const validationError = clientError();
    if (validationError) {
      setError(validationError);
      return;
    }
    setBusy(true);
    setError("");
    const response = await fetch("/api/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });
    const data = (await response.json()) as {
      error?: string;
      role?: "Student" | "Admin" | "Super Admin";
    };
    setBusy(false);
    if (!response.ok) {
      setError(data.error ?? "Could not sign up.");
      return;
    }
    const fallback = data.role === "Student" ? "/student" : "/admin";
    router.push(nextPath || fallback);
    router.refresh();
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-md pt-6">
        <h1 className="text-2xl font-semibold tracking-tight">Sign up</h1>
        <p className="mt-2 text-[15px] leading-6 text-muted">
          Create an Email and password for {SCHOOL.name} Student ID Cards. After
          you sign up you can send a Request. An Admin still checks that you are
          a real student. Staff Emails on the Admin list open the Admin desk.
        </p>
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <label className="block">
            <span className="mb-1 block text-[13px] font-medium">Full name</span>
            <input
              className="w-full rounded-md border border-input-border bg-surface px-3 py-2 text-[15px] outline-none focus:border-accent"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={2}
              maxLength={120}
            />
          </label>
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
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
            />
            <span className="mt-1 block text-[13px] leading-5 text-muted">
              At least 8 characters.
            </span>
          </label>
          <label className="block">
            <span className="mb-1 block text-[13px] font-medium">
              Confirm password
            </span>
            <input
              className="w-full rounded-md border border-input-border bg-surface px-3 py-2 text-[15px] outline-none focus:border-accent"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
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
            {busy ? "Signing up…" : "Sign up"}
          </button>
        </form>
        <p className="mt-3 text-[13px] leading-5">
          Already have an account?{" "}
          <Link
            className="font-medium text-foreground hover:text-accent"
            href={nextPath ? `/sign-in?next=${encodeURIComponent(nextPath)}` : "/sign-in"}
          >
            Sign in
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
