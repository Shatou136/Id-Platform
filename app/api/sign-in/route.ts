import { NextResponse } from "next/server";
import { appOrigin, sendConfirmMail } from "@/lib/mail";
import { confirmPath, ensurePerson } from "@/lib/person";
import { writeSession } from "@/lib/session";
import { normalizeEmail, roleForEmail } from "@/lib/staff";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = normalizeEmail(body.email ?? "");
  const password = body.password ?? "";
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid Email." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }
  await writeSession(email);
  const person = await ensurePerson(email);
  const role = await roleForEmail(email);
  if (role === "Student" && !person.emailConfirmedAt && person.confirmToken) {
    const url = `${appOrigin(request)}${confirmPath(person.confirmToken)}`;
    await sendConfirmMail(email, url);
  }
  return NextResponse.json({ email, role });
}
