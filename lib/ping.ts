import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import webpush from "web-push";
import { prisma } from "@/lib/db";
import { configureWebPush } from "@/lib/vapid";

export type PingKind =
  | "sent"
  | "accepted"
  | "turned_down"
  | "come_collect"
  | "test";

export type PingRecord = {
  id: string;
  kind: PingKind;
  title: string;
  body: string;
  url: string;
  readAt: string | null;
  createdAt: string;
};

const PING_LOG = path.join(process.cwd(), "data", "ping-log.json");

function isPingKind(value: string): value is PingKind {
  return (
    value === "sent" ||
    value === "accepted" ||
    value === "turned_down" ||
    value === "come_collect" ||
    value === "test"
  );
}

function toPingRecord(row: {
  id: string;
  kind: string;
  title: string;
  body: string;
  url: string;
  readAt: Date | null;
  createdAt: Date;
}): PingRecord {
  return {
    id: row.id,
    kind: isPingKind(row.kind) ? row.kind : "sent",
    title: row.title,
    body: row.body,
    url: row.url,
    readAt: row.readAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

async function logPing(record: {
  kind: PingKind;
  to: string;
  title: string;
  body: string;
  sentAt: string;
  delivered: boolean;
}) {
  await mkdir(path.dirname(PING_LOG), { recursive: true });
  let rows: typeof record[] = [];
  try {
    rows = JSON.parse(await readFile(PING_LOG, "utf8")) as typeof record[];
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
  const pushSubscription = JSON.stringify(subscription);
  await prisma.person.upsert({
    where: { email },
    create: {
      email,
      emailConfirmedAt: new Date(),
      pushSubscription,
    },
    update: { pushSubscription },
  });
}

export async function clearPushSubscription(email: string) {
  await prisma.person.updateMany({
    where: { email },
    data: { pushSubscription: null },
  });
}

export async function hasPushSubscription(email: string) {
  const person = await prisma.person.findUnique({
    where: { email },
    select: { pushSubscription: true },
  });
  return Boolean(person?.pushSubscription);
}

export async function listPings(email: string, take = 50): Promise<PingRecord[]> {
  const rows = await prisma.ping.findMany({
    where: { email },
    orderBy: { createdAt: "desc" },
    take,
  });
  return rows.map(toPingRecord);
}

export async function unreadPingCount(email: string) {
  return prisma.ping.count({
    where: { email, readAt: null },
  });
}

export async function markPingsRead(email: string, id?: string) {
  await prisma.ping.updateMany({
    where: id ? { email, id, readAt: null } : { email, readAt: null },
    data: { readAt: new Date() },
  });
}

export async function sendPing(
  to: string,
  kind: PingKind,
  title: string,
  body: string,
  url = "/student",
) {
  await prisma.ping.create({
    data: {
      id: crypto.randomUUID(),
      email: to,
      kind,
      title,
      body,
      url,
    },
  });

  const person = await prisma.person.findUnique({ where: { email: to } });
  let delivered = false;
  if (person?.pushSubscription) {
    try {
      await configureWebPush();
      await webpush.sendNotification(
        JSON.parse(person.pushSubscription) as webpush.PushSubscription,
        JSON.stringify({ title, body, url: "/pings" }),
      );
      delivered = true;
    } catch (error) {
      delivered = false;
      const status = (error as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) {
        await prisma.person.update({
          where: { email: to },
          data: { pushSubscription: null },
        });
      }
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

export async function pingTest(to: string) {
  return sendPing(
    to,
    "test",
    "Phone pings are on",
    "You will get a ping when your Request is sent, accepted, turned down, or ready for Pickup.",
    "/pings",
  );
}

export async function pingSent(to: string) {
  return sendPing(
    to,
    "sent",
    "Your Request was sent",
    "Waiting for an Admin. You cannot change this Request until they respond.",
  );
}

export async function pingAccepted(to: string) {
  return sendPing(
    to,
    "accepted",
    "An Admin accepted your Request",
    "It is not printed yet.",
  );
}

export async function pingTurnedDown(to: string, turnDownReason: string) {
  return sendPing(
    to,
    "turned_down",
    "Your Request was turned down",
    turnDownReason || "Open the app to see why, then fix and send it again.",
  );
}

export async function pingComeCollect(to: string, campus: string) {
  const where = campus.trim() || "your Campus";
  return sendPing(
    to,
    "come_collect",
    "Come collect your Student ID Card",
    `Your Student ID Card is ready for Pickup at ${where}.`,
  );
}
