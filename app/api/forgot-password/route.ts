import { NextResponse } from "next/server";
import { appOrigin, sendResetMail } from "@/lib/mail";
import { requestResetLink, resetPath } from "@/lib/person";
import { normalizeEmail } from "@/lib/staff";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string };
  const email = normalizeEmail(body.email ?? "");
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid Email." }, { status: 400 });
  }
  const token = await requestResetLink(email);
  if (token) {
    await sendResetMail(email, `${appOrigin(request)}${resetPath(token)}`);
  }
  return NextResponse.json({ ok: true });
}
