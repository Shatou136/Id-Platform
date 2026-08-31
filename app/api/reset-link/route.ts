import { NextResponse } from "next/server";
import { appOrigin, mailConfigured, sendResetMail } from "@/lib/mail";
import { requestResetLink, resetPath } from "@/lib/person";
import { readSession } from "@/lib/session";
import { normalizeEmail } from "@/lib/staff";

export async function POST(request: Request) {
  const session = await readSession();
  if (!session || session.role !== "Super Admin") {
    return NextResponse.json(
      { error: "Only a Super Admin can reset a password." },
      { status: 403 },
    );
  }
  const body = (await request.json()) as { email?: string };
  const email = normalizeEmail(body.email ?? "");
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid Email." }, { status: 400 });
  }
  const token = await requestResetLink(email);
  if (!token) {
    return NextResponse.json(
      { error: "That Email is not on this app yet." },
      { status: 404 },
    );
  }
  const path = resetPath(token);
  await sendResetMail(email, `${appOrigin(request)}${path}`);
  return NextResponse.json({
    ok: true,
    email,
    resetPath: mailConfigured() ? null : path,
  });
}
