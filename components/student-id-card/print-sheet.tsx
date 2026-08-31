"use client";

import type { StudentIdCardInput } from "@/lib/card-fields";
import { CardBack } from "./card-back";
import { CardFront } from "./card-front";

export function PrintSheet({
  fields,
  logoSrc,
  schoolName,
}: {
  fields: StudentIdCardInput;
  logoSrc?: string;
  schoolName?: string;
}) {
  return (
    <div className="slui-print-sheet">
      <CardFront
        fields={fields}
        scale="print"
        logoSrc={logoSrc}
        schoolName={schoolName}
      />
      <CardBack scale="print" />
    </div>
  );
}
