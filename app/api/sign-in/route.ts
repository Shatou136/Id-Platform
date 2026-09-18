import { NextResponse } from "next/server";
import { signInWithPassword } from "@/lib/auth";
import { ensurePerson } from "@/lib/person";
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

  const signedIn = await signInWithPassword(email, password);
  if (!signedIn.ok) {
    return NextResponse.json(
      { error: signedIn.error },
      { status: 400 },
    );
  }

  await ensurePerson(email);
  const role = await roleForEmail(email);
  return NextResponse.json({ email, role });
}
