import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { appOrigin } from "@/lib/mail";
import { normalizeEmail } from "@/lib/staff";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string };
  const email = normalizeEmail(body.email ?? "");
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid Email." }, { status: 400 });
  }
  await auth.api.requestPasswordReset({
    body: {
      email,
      redirectTo: `${appOrigin(request)}/reset`,
    },
  });
  return NextResponse.json({ ok: true });
}
