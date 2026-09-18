"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { RequestFieldsForm } from "@/components/request-fields-form";
import { CardFront } from "@/components/student-id-card";
import {
  reasonLabel,
  statusLabel,
  type IdRequest,
  type RequestStatus,
} from "@/lib/id-request";
import type { StudentIdCardInput } from "@/lib/card-fields";
import { officialCampuses, officialProgrammes } from "@/lib/school-identity";

type Queue = "to-check" | "to-print" | "at-campus";

const queues: { id: Queue; label: string; statuses: RequestStatus[] }[] = [
  { id: "to-check", label: "To check", statuses: ["sent"] },
  { id: "to-print", label: "To Print", statuses: ["accepted"] },
  {
    id: "at-campus",
    label: "At Campus",
    statuses: ["printed", "arrived"],
  },
];

async function patchRequest(
  id: string,
  body: Record<string, unknown>,
): Promise<{ request?: IdRequest; error?: string }> {
  const response = await fetch(`/api/requests/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json() as Promise<{ request?: IdRequest; error?: string }>;
}

export default function AdminPage() {
  const [rows, setRows] = useState<IdRequest[]>([]);
  const [queue, setQueue] = useState<Queue>("to-check");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [role, setRole] = useState<"Admin" | "Super Admin">("Admin");
  const [campuses, setCampuses] = useState<string[]>(officialCampuses());
  const [programmes, setProgrammes] = useState<string[]>(officialProgrammes());
  const [logoSrc, setLogoSrc] = useState("/logo.jpg");
  const [schoolName, setSchoolName] = useState("");

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      fetch("/api/requests").then((response) => response.json()),
      fetch("/api/me").then((response) => response.json()),
      fetch("/api/lists").then((response) => response.json()),
    ]).then(([data, me, lists]: [
      { requests?: IdRequest[] },
      { session?: { role?: string } },
      {
        campuses?: string[];
        programmes?: string[];
        logoSrc?: string;
        universityName?: string;
      },
    ]) => {
      if (cancelled) return;
      setRows(data.requests ?? []);
      if (me.session?.role === "Super Admin") setRole("Super Admin");
      setCampuses(officialCampuses(lists.campuses ?? []));
      setProgrammes(officialProgrammes(lists.programmes ?? []));
      if (lists.logoSrc) setLogoSrc(lists.logoSrc);
      if (lists.universityName) setSchoolName(lists.universityName.toUpperCase());
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(
    () =>
      rows.filter((row) =>
        queues.find((item) => item.id === queue)?.statuses.includes(row.status),
      ),
    [rows, queue],
  );

  const selected =
    rows.find((row) => row.id === selectedId) ?? visible[0] ?? null;

  function apply(next: IdRequest) {
    setRows((current) => {
      const index = current.findIndex((row) => row.id === next.id);
      if (index === -1) return [next, ...current];
      const copy = [...current];
      copy[index] = next;
      return copy;
    });
    setSelectedId(next.id);
  }

  return (
    <AppShell role={role}>
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-44">
          <h1 className="mb-3 text-xl font-semibold tracking-tight">Requests</h1>
          <nav className="flex gap-2 lg:flex-col">
            {queues.map((item) => {
              const count = rows.filter((row) =>
                item.statuses.includes(row.status),
              ).length;
              const active = queue === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`rounded-md px-3 py-2 text-left text-[14px] font-medium ${
                    active
                      ? "bg-accent text-white"
                      : "bg-surface text-foreground ring-1 ring-line"
                  }`}
                  onClick={() => {
                    setQueue(item.id);
                    setSelectedId(null);
                  }}
                >
                  {item.label} ({count})
                </button>
              );
            })}
          </nav>
        </aside>

        <section
          className={`min-w-0 flex-1 rounded-lg bg-surface ring-1 ring-line ${
            selected ? "hidden lg:block" : ""
          }`}
        >
          {!loaded ? (
            <p className="p-4 text-[15px] text-muted">Loading…</p>
          ) : visible.length === 0 ? (
            <EmptyQueue queue={queue} />
          ) : (
            <ul>
              {visible.map((row) => {
                const active = selected?.id === row.id;
                return (
                  <li key={row.id} className="border-b border-line">
                    <button
                      type="button"
                      className={`flex w-full items-center gap-3 px-4 py-3 text-left ${
                        active ? "bg-select" : "bg-surface"
                      }`}
                      onClick={() => setSelectedId(row.id)}
                    >
                      {row.fields.photoSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={row.fields.photoSrc}
                          alt=""
                          className="h-10 w-8 object-cover ring-1 ring-line"
                        />
                      ) : (
                        <span className="flex h-10 w-8 items-center justify-center bg-background text-[9px] font-semibold text-muted">
                          Photo
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14px] font-semibold">
                          {row.fields.fullName || "Unnamed"}
                        </span>
                        <span className="block truncate text-[12px] text-muted">
                          {row.fields.matricule || "No Matricule"} ·{" "}
                          {row.fields.campus || "No Campus"} ·{" "}
                          {reasonLabel(row.reason)}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section
          className={`min-w-0 flex-[1.15] rounded-lg bg-surface p-4 ring-1 ring-line ${
            selected ? "" : "hidden lg:block"
          }`}
        >
          {selected ? (
            <AdminDetail
              key={selected.id}
              row={selected}
              onChange={apply}
              onBack={() => setSelectedId(null)}
              campuses={campuses}
              programmes={programmes}
              logoSrc={logoSrc}
              schoolName={schoolName}
            />
          ) : (
            <p className="text-[15px] text-muted">
              Pick a Request from the list.
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}

function EmptyQueue({ queue }: { queue: Queue }) {
  const copy =
    queue === "to-check"
      ? "No Requests to check. When a Student sends one, it will show up here."
      : queue === "to-print"
        ? "Nothing to Print. Accept a Request first."
        : "No cards at a Campus yet. Print, then mark Arrival.";
  return <p className="p-4 text-[15px] leading-6 text-muted">{copy}</p>;
}

function AdminDetail({
  row,
  onChange,
  onBack,
  campuses,
  programmes,
  logoSrc,
  schoolName,
}: {
  row: IdRequest;
  onChange: (row: IdRequest) => void;
  onBack: () => void;
  campuses: string[];
  programmes: string[];
  logoSrc: string;
  schoolName: string;
}) {
  const [turnDown, setTurnDown] = useState(row.turnDownReason);
  const [expiry, setExpiry] = useState(row.fields.expiry);
  const [error, setError] = useState("");
  const beforePrint =
    row.status === "sent" ||
    row.status === "accepted" ||
    row.status === "turned_down";
  const campusLocked =
    row.status === "printed" ||
    row.status === "arrived" ||
    row.status === "picked_up";

  async function save(body: Record<string, unknown>) {
    const result = await patchRequest(row.id, body);
    if (result.error || !result.request) {
      setError(result.error ?? "Could not save.");
      return;
    }
    setError("");
    onChange(result.request);
  }

  return (
    <div className="space-y-4">
      <button
        type="button"
        className="inline-flex min-h-11 items-center gap-1.5 text-[13px] font-medium text-foreground hover:text-accent lg:hidden"
        onClick={onBack}
      >
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
        Back to list
      </button>
      <div>
        <h2 className="text-lg font-semibold">
          {row.fields.fullName || "Request"}
        </h2>
        <p className="text-[13px] text-muted">
          {statusLabel(row.status)} · {reasonLabel(row.reason)}
        </p>
      </div>
      <div className="overflow-x-auto">
        <CardFront
          fields={row.fields}
          logoSrc={logoSrc}
          schoolName={schoolName || undefined}
        />
      </div>

      <RequestFieldsForm
        fields={row.fields}
        allowPhoto={false}
        allowCampus={!campusLocked}
        disabled={row.status === "picked_up"}
        onChange={(fields: StudentIdCardInput) => onChange({ ...row, fields })}
        campuses={campuses}
        programmes={programmes}
      />

      {beforePrint && row.status !== "turned_down" ? (
        <label className="block max-w-xs">
          <span className="mb-1 block text-[13px] font-medium">
            Expiry (VALIDITY year)
          </span>
          <input
            className="w-full rounded-md border border-input-border px-3 py-2 text-[15px] outline-none focus:border-accent"
            inputMode="numeric"
            placeholder="2026"
            value={expiry}
            onChange={(event) => setExpiry(event.target.value)}
          />
        </label>
      ) : null}

      {row.status === "accepted" || row.status === "printed" ? (
        <p className="text-[13px] text-muted">
          VALIDITY on the card: {row.fields.expiry || "not set"}
        </p>
      ) : null}

      {error ? <p className="text-[14px] font-medium text-accent">{error}</p> : null}

      <div className="flex flex-wrap gap-2">
        {row.status === "sent" || row.status === "turned_down" ? (
          <>
            <button
              type="button"
              className="rounded-md bg-accent px-3 py-2 text-[14px] font-semibold text-white"
              onClick={() => {
                if (!/^\d{4}$/.test(expiry.trim())) {
                  setError("Set Expiry as a four-digit year before accepting.");
                  return;
                }
                void save({
                  status: "accepted",
                  turnDownReason: "",
                  expiry: expiry.trim(),
                  fields: { ...row.fields, expiry: expiry.trim() },
                });
              }}
            >
              Accept
            </button>
            <TurnDownControls
              value={turnDown}
              onValue={setTurnDown}
              onConfirm={() => {
                if (!turnDown.trim()) {
                  setError("A written reason is required to turn a Request down.");
                  return;
                }
                void save({
                  status: "turned_down",
                  turnDownReason: turnDown.trim(),
                });
              }}
            />
          </>
        ) : null}

        {row.status === "accepted" ? (
          <>
            <Link
              className="rounded-md bg-accent px-3 py-2 text-[14px] font-semibold text-white"
              href={`/print?id=${row.id}`}
            >
              Print
            </Link>
            <button
              type="button"
              className="rounded-md border border-input-border px-3 py-2 text-[14px] font-medium"
              onClick={() => void save({ status: "printed" })}
            >
              Card printed
            </button>
            <TurnDownControls
              value={turnDown}
              onValue={setTurnDown}
              label="Take back yes"
              onConfirm={() => {
                if (!turnDown.trim()) {
                  setError("A written reason is required to take back a yes.");
                  return;
                }
                void save({
                  status: "turned_down",
                  turnDownReason: turnDown.trim(),
                });
              }}
            />
          </>
        ) : null}

        {row.status === "printed" ? (
          <button
            type="button"
            className="rounded-md bg-accent px-3 py-2 text-[14px] font-semibold text-white"
            onClick={() => void save({ status: "arrived" })}
          >
            Mark Arrival
          </button>
        ) : null}

        {row.status === "arrived" ? (
          <button
            type="button"
            className="rounded-md bg-accent px-3 py-2 text-[14px] font-semibold text-white"
            onClick={() => void save({ status: "picked_up" })}
          >
            Mark Pickup
          </button>
        ) : null}

        {campusLocked ? (
          <p className="basis-full text-[13px] text-muted">
            Campus is on the card. After Print, a Campus change means print this
            Request again.
          </p>
        ) : null}

        {row.status !== "picked_up" ? (
          <button
            type="button"
            className="rounded-md border border-input-border px-3 py-2 text-[14px] font-medium"
            onClick={() => void save({ fields: row.fields })}
          >
            Save details
          </button>
        ) : null}
      </div>
    </div>
  );
}

function TurnDownControls({
  value,
  onValue,
  onConfirm,
  label = "Turn down",
}: {
  value: string;
  onValue: (value: string) => void;
  onConfirm: () => void;
  label?: string;
}) {
  return (
    <div className="flex min-w-[16rem] flex-1 flex-col gap-2">
      <textarea
        className="min-h-16 rounded-md border border-input-border px-3 py-2 text-[14px] outline-none focus:border-accent"
        placeholder="Written reason"
        value={value}
        onChange={(event) => onValue(event.target.value)}
      />
      <button
        type="button"
        className="self-start rounded-md border border-input-border px-3 py-2 text-[14px] font-medium"
        onClick={onConfirm}
      >
        {label}
      </button>
    </div>
  );
}
