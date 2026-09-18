import { NextResponse } from "next/server";
import { clearPushSubscription, savePushSubscription } from "@/lib/ping";
import { readSession } from "@/lib/session";

async function studentSession() {
  const session = await readSession();
  if (!session) {
    return { error: NextResponse.json({ error: "Sign in first." }, { status: 401 }) };
  }
  if (session.role !== "Student") {
    return {
      error: NextResponse.json(
        { error: "Only a Student gets a phone ping." },
        { status: 403 },
      ),
    };
  }
  return { session };
}

export async function POST(request: Request) {
  const auth = await studentSession();
  if ("error" in auth) return auth.error;
  const subscription = await request.json();
  if (!subscription?.endpoint || !subscription?.keys) {
    return NextResponse.json({ error: "Missing push subscription." }, { status: 400 });
  }
  await savePushSubscription(auth.session.email, subscription);
  return NextResponse.json({ ok: true, subscribed: true });
}

export async function DELETE() {
  const auth = await studentSession();
  if ("error" in auth) return auth.error;
  await clearPushSubscription(auth.session.email);
  return NextResponse.json({ ok: true, subscribed: false });
}
