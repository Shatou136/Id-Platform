import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { mailConfigured } from "@/lib/mail";
import { confirmPath } from "@/lib/person";
import { readSession } from "@/lib/session";

export async function GET() {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ session: null }, { status: 401 });
  }
  const person = await prisma.person.findUnique({ where: { email: session.email } });
  const emailConfirmed = Boolean(person?.emailConfirmedAt);
  const mailReady = mailConfigured();
  return NextResponse.json({
    session,
    emailConfirmed,
    mailConfigured: mailReady,
    confirmPath:
      session.role === "Student" && !emailConfirmed && !mailReady
        ? confirmPath(person?.confirmToken)
        : null,
  });
}
