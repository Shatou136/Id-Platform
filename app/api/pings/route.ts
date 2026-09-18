import { NextResponse } from "next/server";
import {
  hasPushSubscription,
  listPings,
  markPingsRead,
  pingTest,
  unreadPingCount,
} from "@/lib/ping";
import { readSession } from "@/lib/session";

export async function GET() {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  if (session.role !== "Student") {
    return NextResponse.json({ error: "Only a Student gets pings." }, { status: 403 });
  }
  const [pings, unreadCount, subscribed] = await Promise.all([
    listPings(session.email),
    unreadPingCount(session.email),
    hasPushSubscription(session.email),
  ]);
  return NextResponse.json({ pings, unreadCount, subscribed });
}

export async function PATCH(request: Request) {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  if (session.role !== "Student") {
    return NextResponse.json({ error: "Only a Student gets pings." }, { status: 403 });
  }
  const body = (await request.json()) as { action?: string; id?: string };
  if (body.action === "test") {
    if (!(await hasPushSubscription(session.email))) {
      return NextResponse.json(
        { error: "Turn phone pings on first." },
        { status: 400 },
      );
    }
    await pingTest(session.email);
    return NextResponse.json({ ok: true });
  }
  if (body.action === "read" && body.id) {
    await markPingsRead(session.email, body.id);
  } else {
    await markPingsRead(session.email);
  }
  return NextResponse.json({
    unreadCount: await unreadPingCount(session.email),
  });
}
