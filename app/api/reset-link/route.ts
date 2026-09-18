import { NextResponse } from "next/server";
import { auth, takeResetPath } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { appOrigin, mailConfigured } from "@/lib/mail";
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
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json(
      { error: "That Email is not on this app yet." },
      { status: 404 },
    );
  }
  await auth.api.requestPasswordReset({
    body: {
      email,
      redirectTo: `${appOrigin(request)}/reset`,
    },
  });
  return NextResponse.json({
    ok: true,
    email,
    resetPath: mailConfigured() ? null : takeResetPath(email),
  });
}
