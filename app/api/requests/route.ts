import { NextResponse } from "next/server";
import { isStaff } from "@/lib/staff";
import { readSession } from "@/lib/session";
import {
  adminQueue,
  createDraft,
  studentLatestRequest,
} from "@/lib/request-db";
import type { RequestReason } from "@/lib/id-request";

export async function GET() {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  if (isStaff(session.role)) {
    return NextResponse.json({ requests: await adminQueue() });
  }
  return NextResponse.json({
    request: await studentLatestRequest(session.email),
  });
}

export async function POST(request: Request) {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  if (session.role !== "Student") {
    return NextResponse.json({ error: "Only a Student can send a Request." }, { status: 403 });
  }
  const body = (await request.json()) as { reason?: RequestReason };
  const reason: RequestReason =
    body.reason === "lost_or_damaged" ? "lost_or_damaged" : "first_card";
  const result = await createDraft(session.email, reason);
  if (result.error && !result.request) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result);
}
