"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import type { StaffRole } from "@/lib/staff";

type Settings = {
  universityName: string;
  logoSrc: string;
  emailEnding: string;
  campuses: string[];
  programmes: string[];
};

type StaffRow = { email: string; role: string };

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [error, setError] = useState("");
  const [campus, setCampus] = useState("");
  const [programme, setProgramme] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const [staffRole, setStaffRole] = useState<StaffRole>("Admin");
  const [resetEmail, setResetEmail] = useState("");
  const [resetNote, setResetNote] = useState("");
  const [resetPath, setResetPath] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [settingsRes, staffRes] = await Promise.all([
        fetch("/api/settings").then((r) => r.json()),
        fetch("/api/staff").then((r) => r.json()),
      ]);
      if (cancelled) return;
      if (settingsRes.universityName) setSettings(settingsRes as Settings);
      if (staffRes.staff) setStaff(staffRes.staff as StaffRow[]);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function patch(body: Record<string, unknown>) {
    const response = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await response.json()) as { error?: string; settings?: Settings };
    if (!response.ok) {
      setError(data.error ?? "Could not save settings.");
      return;
    }
    setError("");
    if (data.settings) setSettings(data.settings);
  }

  if (!settings) {
    return (
      <AppShell role="Super Admin">
        <p className="text-[15px] text-muted">Loading…</p>
      </AppShell>
    );
  }

  return (
    <AppShell role="Super Admin">
      <div className="mx-auto max-w-2xl space-y-8">
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        {error ? <p className="text-[14px] font-medium text-accent">{error}</p> : null}

        <section className="space-y-3 rounded-lg bg-surface p-4 ring-1 ring-line">
          <h2 className="text-lg font-semibold">University</h2>
          <label className="block">
            <span className="mb-1 block text-[13px] font-medium">University name</span>
            <input
              className="w-full rounded-md border border-input-border px-3 py-2 text-[15px] outline-none focus:border-accent"
              value={settings.universityName}
              onChange={(event) =>
                setSettings({ ...settings, universityName: event.target.value })
              }
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[13px] font-medium">
              Email ending (stored for later; sign-up is not locked)
            </span>
            <input
              className="w-full rounded-md border border-input-border px-3 py-2 text-[15px] outline-none focus:border-accent"
              placeholder="slui.org"
              value={settings.emailEnding}
              onChange={(event) =>
                setSettings({ ...settings, emailEnding: event.target.value })
              }
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[13px] font-medium">Logo</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  void patch({ logoDataUrl: String(reader.result ?? "") });
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={settings.logoSrc} alt="" className="h-20 w-20 object-contain" />
          <button
            type="button"
            className="rounded-md bg-accent px-3 py-2 text-[14px] font-semibold text-white"
            onClick={() =>
              void patch({
                universityName: settings.universityName,
                emailEnding: settings.emailEnding,
              })
            }
          >
            Save school settings
          </button>
        </section>

        <section className="space-y-3 rounded-lg bg-surface p-4 ring-1 ring-line">
          <h2 className="text-lg font-semibold">Campuses</h2>
          <ul className="space-y-2">
            {settings.campuses.map((name) => (
              <li key={name} className="flex items-center justify-between gap-2 text-[15px]">
                <span>{name}</span>
                <button
                  type="button"
                  className="text-[13px] font-medium text-accent"
                  onClick={() => void patch({ removeCampus: name })}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-md border border-input-border px-3 py-2 text-[15px] outline-none focus:border-accent"
              value={campus}
              onChange={(event) => setCampus(event.target.value)}
              placeholder="Campus name"
            />
            <button
              type="button"
              className="rounded-md bg-accent px-3 py-2 text-[14px] font-semibold text-white"
              onClick={() => {
                void patch({ addCampus: campus });
                setCampus("");
              }}
            >
              Add Campus
            </button>
          </div>
        </section>

        <section className="space-y-3 rounded-lg bg-surface p-4 ring-1 ring-line">
          <h2 className="text-lg font-semibold">Programmes</h2>
          <ul className="space-y-2">
            {settings.programmes.map((name) => (
              <li key={name} className="flex items-center justify-between gap-2 text-[15px]">
                <span>{name}</span>
                <button
                  type="button"
                  className="text-[13px] font-medium text-accent"
                  onClick={() => void patch({ removeProgramme: name })}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-md border border-input-border px-3 py-2 text-[15px] outline-none focus:border-accent"
              value={programme}
              onChange={(event) => setProgramme(event.target.value)}
              placeholder="Programme name"
            />
            <button
              type="button"
              className="rounded-md bg-accent px-3 py-2 text-[14px] font-semibold text-white"
              onClick={() => {
                void patch({ addProgramme: programme });
                setProgramme("");
              }}
            >
              Add Programme
            </button>
          </div>
        </section>

        <section className="space-y-3 rounded-lg bg-surface p-4 ring-1 ring-line">
          <h2 className="text-lg font-semibold">Admins</h2>
          <ul className="space-y-2">
            {staff.map((row) => (
              <li key={row.email} className="flex items-center justify-between gap-2 text-[15px]">
                <span>
                  {row.email} · {row.role}
                </span>
                <button
                  type="button"
                  className="text-[13px] font-medium text-accent"
                  onClick={async () => {
                    const response = await fetch("/api/staff", {
                      method: "DELETE",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ email: row.email }),
                    });
                    const data = (await response.json()) as {
                      error?: string;
                      staff?: StaffRow[];
                    };
                    if (!response.ok) {
                      setError(data.error ?? "Could not remove.");
                      return;
                    }
                    setError("");
                    setStaff(data.staff ?? []);
                  }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              className="flex-1 rounded-md border border-input-border px-3 py-2 text-[15px] outline-none focus:border-accent"
              type="email"
              value={staffEmail}
              onChange={(event) => setStaffEmail(event.target.value)}
              placeholder="Email"
            />
            <select
              className="rounded-md border border-input-border px-3 py-2 text-[15px]"
              value={staffRole}
              onChange={(event) => setStaffRole(event.target.value as StaffRole)}
            >
              <option value="Admin">Admin</option>
              <option value="Super Admin">Super Admin</option>
            </select>
            <button
              type="button"
              className="rounded-md bg-accent px-3 py-2 text-[14px] font-semibold text-white"
              onClick={async () => {
                const response = await fetch("/api/staff", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: staffEmail, role: staffRole }),
                });
                const data = (await response.json()) as {
                  error?: string;
                  staff?: StaffRow[];
                };
                if (!response.ok) {
                  setError(data.error ?? "Could not add.");
                  return;
                }
                setError("");
                setStaffEmail("");
                setStaff(data.staff ?? []);
              }}
            >
              Add
            </button>
          </div>
        </section>

        <section className="space-y-3 rounded-lg bg-surface p-4 ring-1 ring-line">
          <h2 className="text-lg font-semibold">Reset a password</h2>
          <p className="text-[15px] leading-6 text-muted">
            Send a reset link to an Email. Opening it signs that person in.
            Passwords are not stored until school Auth is connected.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              className="flex-1 rounded-md border border-input-border px-3 py-2 text-[15px] outline-none focus:border-accent"
              type="email"
              value={resetEmail}
              onChange={(event) => setResetEmail(event.target.value)}
              placeholder="Email"
            />
            <button
              type="button"
              className="rounded-md bg-accent px-3 py-2 text-[14px] font-semibold text-white"
              onClick={async () => {
                const response = await fetch("/api/reset-link", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: resetEmail }),
                });
                const data = (await response.json()) as {
                  error?: string;
                  email?: string;
                  resetPath?: string | null;
                };
                if (!response.ok) {
                  setError(data.error ?? "Could not send a reset link.");
                  setResetNote("");
                  setResetPath(null);
                  return;
                }
                setError("");
                setResetNote(`Reset link sent to ${data.email}.`);
                setResetPath(data.resetPath ?? null);
              }}
            >
              Send reset link
            </button>
          </div>
          {resetNote ? (
            <p className="text-[14px] leading-6 text-muted">{resetNote}</p>
          ) : null}
          {resetPath ? (
            <p className="text-[14px] leading-6">
              Mail is not connected yet, so open it here:{" "}
              <a className="font-medium text-accent" href={resetPath}>
                Reset link
              </a>
            </p>
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}
