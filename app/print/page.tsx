"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AdminBackButton } from "@/components/admin-back-button";
import { PrintSheet } from "@/components/student-id-card";
import { PHOTOGRAPHED_SPECIMEN, type StudentIdCardInput } from "@/lib/card-fields";
import type { IdRequest } from "@/lib/id-request";
import "./print.css";

export default function PrintPage() {
  return (
    <Suspense fallback={<p className="print-toolbar">Loading Print…</p>}>
      <PrintClient />
    </Suspense>
  );
}

function PrintClient() {
  const params = useSearchParams();
  const id = params.get("id");
  const [fields, setFields] = useState<StudentIdCardInput>(PHOTOGRAPHED_SPECIMEN);
  const [missing, setMissing] = useState(false);
  const [logoSrc, setLogoSrc] = useState<string>();
  const [schoolName, setSchoolName] = useState<string>();

  useEffect(() => {
    void fetch("/api/lists")
      .then((response) => response.json())
      .then(
        (lists: { logoSrc?: string; universityName?: string }) => {
          if (lists.logoSrc) setLogoSrc(lists.logoSrc);
          if (lists.universityName) {
            setSchoolName(lists.universityName.toUpperCase());
          }
        },
      );
    if (!id) return;
    void fetch(`/api/requests/${id}`)
      .then((response) => response.json())
      .then((data: { request?: IdRequest }) => {
        if (data.request) setFields(data.request.fields);
        else setMissing(true);
      });
  }, [id]);

  return (
    <div>
      <div className="print-toolbar">
        <AdminBackButton
          fallback="/admin"
          className="print-back"
        />
        <button type="button" onClick={() => window.print()}>
          Print Student ID Card
        </button>
        {missing ? (
          <p>
            No Request with that id. Printing the specimen face.
          </p>
        ) : null}
      </div>
      <PrintSheet fields={fields} logoSrc={logoSrc} schoolName={schoolName} />
    </div>
  );
}
