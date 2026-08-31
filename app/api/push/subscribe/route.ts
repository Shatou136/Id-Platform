import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { savePushSubscription } from "@/lib/ping";
import { readSession } from "@/lib/session";

export async function POST(request: Request) {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  if (session.role !== "Student") {
    return NextResponse.json({ error: "Only a Student gets a phone ping." }, { status: 403 });
  }
  const person = await prisma.person.findUnique({ where: { email: session.email } });
  if (!person) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  const subscription = await request.json();
  if (!subscription?.endpoint) {
    return NextResponse.json({ error: "Missing push subscription." }, { status: 400 });
  }
  await savePushSubscription(session.email, subscription);
  return NextResponse.json({ ok: true });
}
