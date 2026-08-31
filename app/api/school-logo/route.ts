import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const ext = new URL(request.url).searchParams.get("ext") === "png" ? "png" : "jpg";
  try {
    const bytes = await readFile(path.join(process.cwd(), "data", `school-logo.${ext}`));
    return new NextResponse(new Uint8Array(bytes), {
      headers: {
        "Content-Type": ext === "png" ? "image/png" : "image/jpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.redirect(new URL("/logo.jpg", request.url));
  }
}
