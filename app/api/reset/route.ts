import { NextResponse } from "next/server";
import { consumeResetToken } from "@/lib/person";
import { writeSession } from "@/lib/session";
import { roleForEmail } from "@/lib/staff";

export async function POST(request: Request) {
  const body = (await request.json()) as { token?: string };
  const token = (body.token ?? "").trim();
  if (!token) {
    return NextResponse.json({ error: "This reset link is not valid." }, { status: 400 });
  }
  const result = await consumeResetToken(token);
  if (result.error || !result.email) {
    return NextResponse.json(
      { error: result.error ?? "This reset link is not valid." },
      { status: 400 },
    );
  }
  await writeSession(result.email);
  const role = await roleForEmail(result.email);
  return NextResponse.json({ email: result.email, role });
}
