import { NextResponse } from "next/server";
import { signUpWithPassword } from "@/lib/auth";
import { ensurePerson } from "@/lib/person";
import { normalizeEmail, roleForEmail } from "@/lib/staff";

function fullNameFrom(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
  const name = fullNameFrom(body.name ?? "");
  const email = normalizeEmail(body.email ?? "");
  const password = body.password ?? "";
  const confirmPassword = body.confirmPassword ?? "";

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Enter your full name." }, { status: 400 });
  }
  if (name.length > 120) {
    return NextResponse.json(
      { error: "Full name is too long." },
      { status: 400 },
    );
  }
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Enter a valid Email." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }
  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Passwords do not match." },
      { status: 400 },
    );
  }

  const signedUp = await signUpWithPassword(email, password, name);
  if (!signedUp.ok) {
    return NextResponse.json({ error: signedUp.error }, { status: 400 });
  }

  await ensurePerson(email);
  const role = await roleForEmail(email);
  return NextResponse.json({ email, role });
}
