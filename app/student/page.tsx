"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { PhonePing } from "@/components/phone-ping";
import { RequestFieldsForm } from "@/components/request-fields-form";
import { CardBack, CardFront } from "@/components/student-id-card";
import type { StudentIdCardInput } from "@/lib/card-fields";
import {
  reasonLabel,
  statusLabel,
  type IdRequest,
  type RequestReason,
} from "@/lib/id-request";

export default function StudentPage() {
  const [row, setRow] = useState<IdRequest | null>(null);
  const [error, setError] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [emailConfirmed, setEmailConfirmed] = useState(false);
  const [confirmPath, setConfirmPath] = useState<string | null>(null);
  const [mailConfigured, setMailConfigured] = useState(false);
  const [campuses, setCampuses] = useState<string[]>([]);
  const [programmes, setProgrammes] = useState<string[]>([]);
  const [logoSrc, setLogoSrc] = useState("/logo.jpg");
  const [schoolName, setSchoolName] = useState("");

  useEffect(() => {
    let cancelled = false;
    void Promise.all([
      fetch("/api/requests").then((response) => response.json()),
      fetch("/api/me").then((response) => response.json()),
      fetch("/api/lists").then((response) => response.json()),
    ]).then(([requestData, me, lists]: [
      { request?: IdRequest | null },
      {
        emailConfirmed?: boolean;
        confirmPath?: string | null;
        mailConfigured?: boolean;
      },
      {
        campuses?: string[];
        programmes?: string[];
        logoSrc?: string;
        universityName?: string;
      },
    ]) => {
      if (cancelled) return;
      setRow(requestData.request ?? null);
      setEmailConfirmed(Boolean(me.emailConfirmed));
      setConfirmPath(me.confirmPath ?? null);
      setMailConfigured(Boolean(me.mailConfigured));
      setCampuses(lists.campuses ?? []);
      setProgrammes(lists.programmes ?? []);
      if (lists.logoSrc) setLogoSrc(lists.logoSrc);
      if (lists.universityName) {
        setSchoolName(lists.universityName.toUpperCase());
      }
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const editable = row?.status === "draft" || row?.status === "turned_down";

  async function start(reason: RequestReason) {
    setError("");
    const response = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });
    const data = (await response.json()) as {
      request?: IdRequest;
      error?: string;
    };
    if (!response.ok) {
      setError(data.error ?? "Could not start a Request.");
      return;
    }
    setRow(data.request ?? null);
  }

  async function updateFields(fields: StudentIdCardInput) {
    if (!row || !editable) return;
    setRow({ ...row, fields });
  }

  async function saveDraft() {
    if (!row) return;
    const response = await fetch(`/api/requests/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: row.fields }),
    });
    const data = (await response.json()) as {
      request?: IdRequest;
      error?: string;
    };
    if (!response.ok) {
      setError(data.error ?? "Could not save.");
      return;
    }
    setError("");
    setRow(data.request ?? row);
  }

  async function send() {
    if (!row) return;
    await saveDraft();
    const response = await fetch(`/api/requests/${row.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "send", fields: row.fields }),
    });
    const data = (await response.json()) as {
      request?: IdRequest;
      error?: string;
    };
    if (!response.ok) {
      setError(data.error ?? "Could not send.");
      return;
    }
    setError("");
    setRow(data.request ?? row);
  }

  if (!loaded) {
    return (
      <AppShell role="Student">
        <p className="text-[15px] text-muted">Loading…</p>
      </AppShell>
    );
  }

  return (
    <AppShell role="Student">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto]">
        <section className="max-w-xl">
          <h1 className="text-2xl font-semibold tracking-tight">
            Your Student ID Card
          </h1>
          <PhonePing />
          {!emailConfirmed ? (
            <div className="mt-4 rounded-md border border-info bg-info-fill px-4 py-3 text-[15px] leading-6">
              <p>
                {mailConfigured
                  ? "A confirm link was sent to your Email. Click it before you can send a Request."
                  : "Click the confirm link sent to your Email before you can send a Request."}
              </p>
              {confirmPath ? (
                <p className="mt-2">
                  Mail is not connected yet, so open it here:{" "}
                  <a className="font-medium text-accent" href={confirmPath}>
                    Confirm Email
                  </a>
                </p>
              ) : null}
            </div>
          ) : null}
          {!row || row.status === "picked_up" ? (
            <EmptyStudent last={row} onStart={start} />
          ) : (
            <ActiveStudent
              row={row}
              editable={Boolean(editable)}
              error={error}
              emailConfirmed={emailConfirmed}
              onFields={updateFields}
              onSaveDraft={saveDraft}
              onSend={send}
              campuses={campuses}
              programmes={programmes}
            />
          )}
        </section>
        {row && row.status !== "picked_up" ? (
          <aside className="space-y-4">
            <h2 className="text-lg font-semibold">Card face</h2>
            <div className="overflow-x-auto">
              <CardFront
                fields={row.fields}
                logoSrc={logoSrc}
                schoolName={schoolName || undefined}
              />
            </div>
            <div className="overflow-x-auto">
              <CardBack />
            </div>
          </aside>
        ) : null}
      </div>
    </AppShell>
  );
}

function EmptyStudent({
  last,
  onStart,
}: {
  last: IdRequest | null;
  onStart: (reason: RequestReason) => void;
}) {
  const replacement = last?.status === "picked_up";
  return (
    <div className="mt-4 space-y-4">
      <p className="text-[15px] leading-6 text-muted">
        {replacement
          ? "Your last card was collected. You can send a Request for a lost or damaged card."
          : "You do not have an Open Request. Send a Request for your first Student ID Card."}
      </p>
      <button
        type="button"
        className="rounded-md bg-accent px-4 py-2.5 text-[15px] font-semibold text-white"
        onClick={() => onStart(replacement ? "lost_or_damaged" : "first_card")}
      >
        {replacement ? "Request a replacement" : "Send a Request"}
      </button>
    </div>
  );
}

function ActiveStudent({
  row,
  editable,
  error,
  emailConfirmed,
  onFields,
  onSaveDraft,
  onSend,
  campuses,
  programmes,
}: {
  row: IdRequest;
  editable: boolean;
  error: string;
  emailConfirmed: boolean;
  onFields: (fields: StudentIdCardInput) => void;
  onSaveDraft: () => void;
  onSend: () => void;
  campuses: string[];
  programmes: string[];
}) {
  return (
    <div className="mt-4 space-y-5">
      <p className="text-[15px] leading-6">
        <strong>{statusLabel(row.status)}</strong>
        {" · "}
        {reasonLabel(row.reason)}
      </p>
      {row.status === "turned_down" ? (
        <div className="rounded-md border border-accent bg-surface px-4 py-3 text-[15px] leading-6">
          <p className="font-semibold">This Request was turned down.</p>
          <p className="mt-1">{row.turnDownReason}</p>
          <p className="mt-1 text-muted">Fix the details and send it again.</p>
        </div>
      ) : null}
      {row.status === "arrived" ? (
        <p className="rounded-md border border-info bg-info-fill px-4 py-3 text-[15px] leading-6">
          Come collect your Student ID Card at {row.fields.campus || "your Campus"}.
        </p>
      ) : null}
      {row.status === "printed" ? (
        <p className="text-[15px] leading-6 text-muted">
          The card has been printed. You will be told when it has arrived at{" "}
          {row.fields.campus || "your Campus"}.
        </p>
      ) : null}
      {row.status === "accepted" ? (
        <p className="text-[15px] leading-6 text-muted">
          An Admin accepted this Request. It is not printed yet.
        </p>
      ) : null}
      {row.status === "sent" ? (
        <p className="text-[15px] leading-6 text-muted">
          Waiting for an Admin. You cannot change this Request until they
          respond.
        </p>
      ) : null}


      <RequestFieldsForm
        fields={row.fields}
        onChange={onFields}
        disabled={!editable}
        campuses={campuses}
        programmes={programmes}
      />

      {error ? <p className="text-[14px] font-medium text-accent">{error}</p> : null}

      {editable ? (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-md bg-accent px-4 py-2.5 text-[15px] font-semibold text-white disabled:opacity-60"
            disabled={!emailConfirmed}
            onClick={onSend}
          >
            {row.status === "turned_down" ? "Send again" : "Send Request"}
          </button>
          <button
            type="button"
            className="rounded-md border border-input-border bg-surface px-4 py-2.5 text-[15px] font-medium"
            onClick={onSaveDraft}
          >
            Save draft
          </button>
        </div>
      ) : null}
    </div>
  );
}
