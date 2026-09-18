import { prisma } from "@/lib/db";
import type { Request as DbRequest } from "@prisma/client";
import {
  emptyFields,
  type IdRequest,
  type RequestReason,
  type RequestStatus,
} from "@/lib/id-request";
import type { StudentIdCardInput } from "@/lib/card-fields";
import { persistPhoto } from "@/lib/photo-store";

const OPEN: RequestStatus[] = [
  "draft",
  "sent",
  "turned_down",
  "accepted",
  "printed",
  "arrived",
];

function isStatus(value: string): value is RequestStatus {
  return (
    value === "draft" ||
    value === "sent" ||
    value === "turned_down" ||
    value === "accepted" ||
    value === "printed" ||
    value === "arrived" ||
    value === "picked_up"
  );
}

function isReason(value: string): value is RequestReason {
  return value === "first_card" || value === "lost_or_damaged";
}

export function toIdRequest(row: DbRequest): IdRequest {
  return {
    id: row.id,
    status: isStatus(row.status) ? row.status : "draft",
    reason: isReason(row.reason) ? row.reason : "first_card",
    fields: {
      fullName: row.fullName,
      sex: row.sex === "Male" ? "Male" : "Female",
      dateOfBirth: row.dateOfBirth,
      placeOfBirth: row.placeOfBirth,
      matricule: row.matricule,
      programme: row.programme,
      campus: row.campus,
      expiry: row.expiry,
      photoSrc: row.photoSrc,
    },
    turnDownReason: row.turnDownReason,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function fieldData(fields: StudentIdCardInput) {
  return {
    fullName: fields.fullName,
    sex: fields.sex,
    dateOfBirth: fields.dateOfBirth,
    placeOfBirth: fields.placeOfBirth,
    matricule: fields.matricule,
    programme: fields.programme,
    campus: fields.campus,
    expiry: fields.expiry,
    photoSrc: fields.photoSrc,
  };
}

export async function studentOpenRequest(studentEmail: string) {
  const row = await prisma.request.findFirst({
    where: { studentEmail, status: { in: OPEN } },
    orderBy: { createdAt: "desc" },
  });
  return row ? toIdRequest(row) : null;
}

export async function studentLatestRequest(studentEmail: string) {
  const open = await studentOpenRequest(studentEmail);
  if (open) return open;
  const row = await prisma.request.findFirst({
    where: { studentEmail },
    orderBy: { createdAt: "desc" },
  });
  return row ? toIdRequest(row) : null;
}

export async function adminQueue() {
  const rows = await prisma.request.findMany({
    where: { status: { not: "draft" } },
    orderBy: { updatedAt: "desc" },
  });
  return rows.map(toIdRequest);
}

export async function getRequestById(id: string) {
  const row = await prisma.request.findUnique({ where: { id } });
  return row ? toIdRequest(row) : null;
}

export async function getRequestRecord(id: string) {
  return prisma.request.findUnique({ where: { id } });
}

export async function createDraft(
  studentEmail: string,
  reason: RequestReason,
) {
  const existing = await studentOpenRequest(studentEmail);
  if (existing) return { error: "You already have an Open Request.", request: existing };
  if (reason === "lost_or_damaged") {
    const last = await prisma.request.findFirst({
      where: { studentEmail, status: "picked_up" },
    });
    if (!last) {
      return { error: "A lost or damaged Request is allowed only after Pickup." };
    }
  }
  const fields = emptyFields();
  const row = await prisma.request.create({
    data: {
      id: crypto.randomUUID(),
      studentEmail,
      status: "draft",
      reason,
      ...fieldData(fields),
    },
  });
  return { request: toIdRequest(row) };
}

export async function saveStudentFields(
  id: string,
  studentEmail: string,
  fields: StudentIdCardInput,
) {
  const row = await prisma.request.findUnique({ where: { id } });
  if (!row || row.studentEmail !== studentEmail) {
    return { error: "Request not found." };
  }
  if (row.status !== "draft" && row.status !== "turned_down") {
    return { error: "This Request cannot be changed." };
  }
  const photoSrc = await persistPhoto(id, fields.photoSrc);
  const updated = await prisma.request.update({
    where: { id },
    data: fieldData({ ...fields, photoSrc }),
  });
  return { request: toIdRequest(updated) };
}

export async function sendRequest(id: string, studentEmail: string) {
  const row = await prisma.request.findUnique({ where: { id } });
  if (!row || row.studentEmail !== studentEmail) {
    return { error: "Request not found." };
  }
  if (row.status !== "draft" && row.status !== "turned_down") {
    return { error: "This Request cannot be sent." };
  }
  const missing = missingFields(toIdRequest(row).fields);
  if (missing) return { error: `Add ${missing} before sending.` };
  const taken = await prisma.request.findFirst({
    where: {
      matricule: row.matricule,
      status: { in: OPEN },
      NOT: { id },
    },
  });
  if (taken) {
    return { error: "Only one Open Request may use a given Matricule." };
  }
  const updated = await prisma.request.update({
    where: { id },
    data: { status: "sent", turnDownReason: "" },
  });
  return { request: toIdRequest(updated) };
}

export async function adminUpdate(
  id: string,
  patch: {
    fields?: StudentIdCardInput;
    status?: RequestStatus;
    turnDownReason?: string;
    expiry?: string;
  },
) {
  const row = await prisma.request.findUnique({ where: { id } });
  if (!row) return { error: "Request not found." };
  if (row.status === "draft") return { error: "Admins do not see drafts." };

  const data: Record<string, string> = {};
  if (patch.fields) {
    const next = fieldData(patch.fields);
    next.photoSrc = row.photoSrc;
    if (row.status === "printed" || row.status === "arrived" || row.status === "picked_up") {
      next.campus = row.campus;
    }
    Object.assign(data, next);
  }
  if (patch.expiry !== undefined) data.expiry = patch.expiry;
  if (patch.turnDownReason !== undefined) data.turnDownReason = patch.turnDownReason;
  if (patch.status) data.status = patch.status;

  const updated = await prisma.request.update({ where: { id }, data });
  return { request: toIdRequest(updated) };
}

function missingFields(fields: StudentIdCardInput) {
  if (!fields.fullName.trim()) return "full name";
  if (!fields.dateOfBirth) return "Date of birth";
  if (!fields.placeOfBirth.trim()) return "Place of birth";
  if (!fields.matricule.trim()) return "Matricule";
  if (!fields.programme) return "Programme";
  if (!fields.campus) return "Campus";
  if (!fields.photoSrc) return "Photo";
  return "";
}
