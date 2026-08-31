import { NextResponse } from "next/server";
import {
  addCampus,
  addProgramme,
  getSchoolSettings,
  removeCampus,
  removeProgramme,
  updateSchoolSettings,
} from "@/lib/school-settings";
import { readSession } from "@/lib/session";

export async function GET() {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  if (session.role !== "Super Admin") {
    return NextResponse.json({ error: "Only a Super Admin can change settings." }, { status: 403 });
  }
  return NextResponse.json(await getSchoolSettings());
}

export async function PATCH(request: Request) {
  const session = await readSession();
  if (!session || session.role !== "Super Admin") {
    return NextResponse.json({ error: "Only a Super Admin can change settings." }, { status: 403 });
  }
  const body = (await request.json()) as {
    universityName?: string;
    emailEnding?: string;
    logoDataUrl?: string;
    addCampus?: string;
    removeCampus?: string;
    addProgramme?: string;
    removeProgramme?: string;
  };
  if (body.addCampus) {
    const result = await addCampus(body.addCampus);
    if (result.error) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(result);
  }
  if (body.removeCampus) {
    return NextResponse.json(await removeCampus(body.removeCampus));
  }
  if (body.addProgramme) {
    const result = await addProgramme(body.addProgramme);
    if (result.error) return NextResponse.json(result, { status: 400 });
    return NextResponse.json(result);
  }
  if (body.removeProgramme) {
    return NextResponse.json(await removeProgramme(body.removeProgramme));
  }
  const result = await updateSchoolSettings(body);
  if (result.error) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}
