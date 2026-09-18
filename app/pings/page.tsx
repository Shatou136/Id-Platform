"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { PhonePingSwitch } from "@/components/phone-ping-switch";
import type { PingKind, PingRecord } from "@/lib/ping";

function kindLabel(kind: PingKind) {
  switch (kind) {
    case "sent":
      return "Sent";
    case "accepted":
      return "Accepted";
    case "turned_down":
      return "Turned down";
    case "come_collect":
      return "Ready for Pickup";
    case "test":
      return "Phone pings";
  }
}

function whenLabel(iso: string) {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";
  const minutes = Math.max(0, Math.round((Date.now() - then) / 60000));
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString();
}

export default function PingsPage() {
  const [pings, setPings] = useState<PingRecord[] | null>(null);

  const load = useCallback(async () => {
    const response = await fetch("/api/pings");
    if (!response.ok) {
      setPings([]);
      return;
    }
    const data = (await response.json()) as { pings?: PingRecord[] };
    setPings(data.pings ?? []);
  }, []);

  useEffect(() => {
    void load();
    void fetch("/api/pings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "read_all" }),
    });
  }, [load]);

  return (
    <AppShell role="Student">
      <section className="mx-auto max-w-xl">
        <h1 className="text-2xl font-semibold tracking-tight">Pings</h1>
        <p className="mt-2 text-[15px] leading-6 text-muted">
          Phone pings tell you when a Request is sent, accepted, turned down, or
          ready for Pickup. Print does not ping. Email is the backup if a ping
          never arrives.
        </p>

        <div className="mt-5">
          <PhonePingSwitch />
        </div>

        {pings === null ? (
          <p className="mt-6 text-[15px] text-muted">Loading…</p>
        ) : pings.length === 0 ? (
          <p className="mt-6 text-[15px] leading-6 text-muted">
            No pings yet. When you send a Request, or an Admin acts on it, the
            message shows here.
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {pings.map((ping) => (
              <li key={ping.id}>
                <Link
                  href={ping.url || "/student"}
                  className="block py-3.5 no-underline hover:bg-secondary/60"
                >
                  <p className="text-[12px] font-medium text-muted">
                    {kindLabel(ping.kind)}
                    <span className="font-normal"> · {whenLabel(ping.createdAt)}</span>
                  </p>
                  <p className="mt-1 text-[15px] font-semibold leading-5">
                    {ping.title}
                  </p>
                  <p className="mt-1 text-[14px] leading-5 text-muted">{ping.body}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AppShell>
  );
}
