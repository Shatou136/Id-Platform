import { NextResponse } from "next/server";
import { notifyComeCollect, notifyTurnedDown } from "@/lib/notify";
import { isStaff } from "@/lib/staff";
import { readSession } from "@/lib/session";
import {
  adminUpdate,
  getRequestById,
  getRequestRecord,
  saveStudentFields,
  sendRequest,
} from "@/lib/request-db";
import type { StudentIdCardInput } from "@/lib/card-fields";
import type { RequestStatus } from "@/lib/id-request";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  const { id } = await params;
  const row = await getRequestRecord(id);
  if (!row) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 });
  }
  if (session.role === "Student" && row.studentEmail !== session.email) {
    return NextResponse.json({ error: "Request not found." }, { status: 404 });
  }
  if (isStaff(session.role) && row.status === "draft") {
    return NextResponse.json({ error: "Admins do not see drafts." }, { status: 404 });
  }
  return NextResponse.json({ request: await getRequestById(id) });
}

export async function PATCH(request: Request, { params }: Params) {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  const { id } = await params;
  const body = (await request.json()) as {
    action?: string;
    fields?: StudentIdCardInput;
    status?: RequestStatus;
    turnDownReason?: string;
    expiry?: string;
  };

  if (session.role === "Student") {
    if (body.action === "send") {
      if (body.fields) {
        const saved = await saveStudentFields(id, session.email, body.fields);
        if (saved.error) {
          return NextResponse.json({ error: saved.error }, { status: 400 });
        }
      }
      const result = await sendRequest(id, session.email);
      if (result.error) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json(result);
    }
    if (!body.fields) {
      return NextResponse.json({ error: "Nothing to save." }, { status: 400 });
    }
    const result = await saveStudentFields(id, session.email, body.fields);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json(result);
  }

  const before = await getRequestRecord(id);
  const result = await adminUpdate(id, {
    fields: body.fields,
    status: body.status,
    turnDownReason: body.turnDownReason,
    expiry: body.expiry,
  });
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  if (result.request && before) {
    const next = result.request;
    if (next.status === "turned_down" && before.status !== "turned_down") {
      await notifyTurnedDown(
        before.studentEmail,
        next.fields.fullName,
        next.turnDownReason,
      );
    }
    if (next.status === "arrived" && before.status !== "arrived") {
      await notifyComeCollect(
        before.studentEmail,
        next.fields.fullName,
        next.fields.campus,
      );
    }
  }
  return NextResponse.json(result);
}
