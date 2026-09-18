import { NextResponse } from "next/server";
import { auth, messageFromAuthError } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { token?: string; password?: string };
  const token = (body.token ?? "").trim();
  const password = body.password ?? "";
  if (!token) {
    return NextResponse.json({ error: "This reset link is not valid." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json(
      { error: "Password must be at least 8 characters." },
      { status: 400 },
    );
  }
  try {
    await auth.api.resetPassword({
      body: {
        newPassword: password,
        token,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: messageFromAuthError(error, "This reset link is not valid.") },
      { status: 400 },
    );
  }
  return NextResponse.json({ ok: true });
}
