"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { SCHOOL } from "@/lib/school-identity";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch("/api/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = (await response.json()) as { error?: string };
    setBusy(false);
    if (!response.ok) {
      setError(data.error ?? "Could not send a reset link.");
      return;
    }
    setSent(true);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-md pt-6">
        <h1 className="text-2xl font-semibold tracking-tight">Forgot password</h1>
        {sent ? (
          <p className="mt-4 text-[15px] leading-6 text-muted">
            If that Email is used for {SCHOOL.name} Student ID Cards, we sent a
            reset link. Open it to choose a new password.
          </p>
        ) : (
          <>
            <p className="mt-2 text-[15px] leading-6 text-muted">
              Enter the Email you use for {SCHOOL.name} Student ID Cards. We
              will send a reset link.
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
              {error ? (
                <p className="text-[14px] font-medium text-accent">{error}</p>
              ) : null}
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-md bg-accent px-4 py-2.5 text-[15px] font-semibold text-white disabled:opacity-60"
              >
                {busy ? "Sending…" : "Send reset link"}
              </button>
            </form>
          </>
        )}
        <p className="mt-6 text-[13px] leading-5">
          <Link className="font-medium text-foreground hover:text-accent" href="/sign-in">
            Back to sign in
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
