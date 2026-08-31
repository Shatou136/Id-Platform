import { NextResponse } from "next/server";
import { getRequestRecord } from "@/lib/request-db";
import { readPhoto, requestIdFromPhotoName } from "@/lib/photo-store";
import { readSession } from "@/lib/session";

type Params = { params: Promise<{ filename: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  const { filename } = await params;
  const requestId = requestIdFromPhotoName(filename);
  const row = await getRequestRecord(requestId);
  if (!row) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }
  if (session.role === "Student" && row.studentEmail !== session.email) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }
  const photo = await readPhoto(filename);
  if (!photo) {
    return NextResponse.json({ error: "Photo not found." }, { status: 404 });
  }
  return new NextResponse(new Uint8Array(photo.bytes), {
    headers: {
      "Content-Type": photo.type,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
