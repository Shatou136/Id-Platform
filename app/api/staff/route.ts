import { NextResponse } from "next/server";
import { addStaff, listStaff, removeStaff, type StaffRole } from "@/lib/staff";
import { readSession } from "@/lib/session";

export async function GET() {
  const session = await readSession();
  if (!session || session.role !== "Super Admin") {
    return NextResponse.json({ error: "Only a Super Admin can change who is an Admin." }, { status: 403 });
  }
  return NextResponse.json({ staff: await listStaff() });
}

export async function POST(request: Request) {
  const session = await readSession();
  if (!session || session.role !== "Super Admin") {
    return NextResponse.json({ error: "Only a Super Admin can change who is an Admin." }, { status: 403 });
  }
  const body = (await request.json()) as { email?: string; role?: StaffRole };
  const role: StaffRole = body.role === "Super Admin" ? "Super Admin" : "Admin";
  const result = await addStaff(body.email ?? "", role);
  if (result.error) return NextResponse.json(result, { status: 400 });
  return NextResponse.json({ staff: await listStaff() });
}

export async function DELETE(request: Request) {
  const session = await readSession();
  if (!session || session.role !== "Super Admin") {
    return NextResponse.json({ error: "Only a Super Admin can change who is an Admin." }, { status: 403 });
  }
  const body = (await request.json()) as { email?: string };
  const result = await removeStaff(body.email ?? "");
  if (result.error) return NextResponse.json(result, { status: 400 });
  return NextResponse.json({ staff: await listStaff() });
}
