import { NextResponse } from "next/server";
import { vapidKeys } from "@/lib/vapid";

export async function GET() {
  const keys = await vapidKeys();
  return NextResponse.json({ publicKey: keys.publicKey });
}
