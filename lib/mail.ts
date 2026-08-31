import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { Resend } from "resend";
import { SCHOOL } from "@/lib/school-identity";

export type MailKind = "confirm" | "turned_down" | "come_collect" | "reset";

export type MailRecord = {
  kind: MailKind;
  to: string;
  subject: string;
  text: string;
  sentAt: string;
  delivered: boolean;
};

const MAIL_LOG = path.join(process.cwd(), "data", "mail-log.json");

export function mailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}

export function appOrigin(request: Request) {
  if (process.env.APP_BASE_URL) {
    return process.env.APP_BASE_URL.replace(/\/$/, "");
  }
  return new URL(request.url).origin;
}

function fromAddress() {
  return (
    process.env.MAIL_FROM ??
    `${SCHOOL.shortName} Student ID Cards <onboarding@resend.dev>`
  );
}

async function logMail(record: MailRecord) {
  await mkdir(path.dirname(MAIL_LOG), { recursive: true });
  let rows: MailRecord[] = [];
  try {
    rows = JSON.parse(await readFile(MAIL_LOG, "utf8")) as MailRecord[];
    if (!Array.isArray(rows)) rows = [];
  } catch {
    rows = [];
  }
  rows.push(record);
  await writeFile(MAIL_LOG, JSON.stringify(rows, null, 2));
}

async function deliver(kind: MailKind, to: string, subject: string, text: string) {
  let delivered = false;
  if (mailConfigured()) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: fromAddress(),
      to,
      subject,
      text,
    });
    delivered = !result.error;
  }
  await logMail({
    kind,
    to,
    subject,
    text,
    sentAt: new Date().toISOString(),
    delivered,
  });
  return delivered;
}

export async function sendConfirmMail(to: string, confirmUrl: string) {
  return deliver(
    "confirm",
    to,
    `Confirm your Email for ${SCHOOL.name} Student ID Cards`,
    [
      `Confirm this Email so you can send a Request for a Student ID Card at ${SCHOOL.name}.`,
      "",
      confirmUrl,
      "",
      "If you did not ask for this, ignore this mail.",
    ].join("\n"),
  );
}

export async function sendTurnedDownMail(
  to: string,
  fullName: string,
  turnDownReason: string,
) {
  const who = fullName.trim() || "Student";
  return deliver(
    "turned_down",
    to,
    `Your Request for a Student ID Card was turned down`,
    [
      `Hello ${who},`,
      "",
      "Your Request for a Student ID Card was turned down.",
      "",
      turnDownReason,
      "",
      "Open the app to see the reason, fix the Request, and send it again.",
      "",
      SCHOOL.name,
    ].join("\n"),
  );
}

export async function sendResetMail(to: string, resetUrl: string) {
  return deliver(
    "reset",
    to,
    `Reset link for ${SCHOOL.name} Student ID Cards`,
    [
      `Use this link to sign in to ${SCHOOL.name} Student ID Cards.`,
      "",
      resetUrl,
      "",
      "If you did not ask for this, ignore this mail.",
    ].join("\n"),
  );
}

export async function sendComeCollectMail(
  to: string,
  fullName: string,
  campus: string,
) {
  const who = fullName.trim() || "Student";
  const where = campus.trim() || "your Campus";
  return deliver(
    "come_collect",
    to,
    `Your Student ID Card is ready for Pickup`,
    [
      `Hello ${who},`,
      "",
      `Your Student ID Card is ready for Pickup at ${where}.`,
      "",
      "Come collect it at that Campus. Do not come before Arrival.",
      "",
      SCHOOL.name,
    ].join("\n"),
  );
}
