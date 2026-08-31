import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import webpush from "web-push";
import { prisma } from "@/lib/db";
import { configureWebPush } from "@/lib/vapid";

export type PingKind = "turned_down" | "come_collect";

export type PingRecord = {
  kind: PingKind;
  to: string;
  title: string;
  body: string;
  sentAt: string;
  delivered: boolean;
};

const PING_LOG = path.join(process.cwd(), "data", "ping-log.json");

async function logPing(record: PingRecord) {
  await mkdir(path.dirname(PING_LOG), { recursive: true });
  let rows: PingRecord[] = [];
  try {
    rows = JSON.parse(await readFile(PING_LOG, "utf8")) as PingRecord[];
    if (!Array.isArray(rows)) rows = [];
  } catch {
    rows = [];
  }
  rows.push(record);
  await writeFile(PING_LOG, JSON.stringify(rows, null, 2));
}

export async function savePushSubscription(
  email: string,
  subscription: unknown,
) {
  await prisma.person.update({
    where: { email },
    data: { pushSubscription: JSON.stringify(subscription) },
  });
}

export async function sendPing(
  to: string,
  kind: PingKind,
  title: string,
  body: string,
  url: string,
) {
  const person = await prisma.person.findUnique({ where: { email: to } });
  let delivered = false;
  if (person?.pushSubscription) {
    try {
      await configureWebPush();
      await webpush.sendNotification(
        JSON.parse(person.pushSubscription) as webpush.PushSubscription,
        JSON.stringify({ title, body, url }),
      );
      delivered = true;
    } catch {
      delivered = false;
    }
  }
  await logPing({
    kind,
    to,
    title,
    body,
    sentAt: new Date().toISOString(),
    delivered,
  });
  return delivered;
}

export async function pingTurnedDown(to: string, turnDownReason: string) {
  return sendPing(
    to,
    "turned_down",
    "Your Request was turned down",
    turnDownReason || "Open the app to see why, then fix and send it again.",
    "/student",
  );
}

export async function pingComeCollect(to: string, campus: string) {
  const where = campus.trim() || "your Campus";
  return sendPing(
    to,
    "come_collect",
    "Come collect your Student ID Card",
    `Your Student ID Card is ready for Pickup at ${where}.`,
    "/student",
  );
}


