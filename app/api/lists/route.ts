import { NextResponse } from "next/server";
import { getSchoolSettings } from "@/lib/school-settings";
import { readSession } from "@/lib/session";

export async function GET() {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  return NextResponse.json(await getSchoolSettings());
}
