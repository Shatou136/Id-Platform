import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";
import { roleForEmail } from "@/lib/staff";

export async function ensurePerson(email: string) {
  const existing = await prisma.person.findUnique({ where: { email } });
  if (existing?.emailConfirmedAt && !existing.confirmToken) return existing;
  return prisma.person.upsert({
    where: { email },
    create: { email, emailConfirmedAt: new Date() },
    update: {
      emailConfirmedAt: existing?.emailConfirmedAt ?? new Date(),
      confirmToken: null,
      confirmExpiresAt: null,
    },
  });
}

export async function confirmEmail(token: string) {
  const person = await prisma.person.findUnique({ where: { confirmToken: token } });
  if (!person) return { error: "This confirm link is not valid." };
  if (person.confirmExpiresAt && person.confirmExpiresAt.getTime() < Date.now()) {
    return { error: "This confirm link has expired. Sign in again to get a new one." };
  }
  await prisma.person.update({
    where: { email: person.email },
    data: {
      emailConfirmedAt: new Date(),
      confirmToken: null,
      confirmExpiresAt: null,
    },
  });
  return { email: person.email };
}

const RESET_MS = 2 * 60 * 60 * 1000;

export function resetPath(token: string | null | undefined) {
  return token ? `/reset/${token}` : null;
}

export async function issueResetToken(email: string) {
  const token = randomBytes(24).toString("hex");
  const resetExpiresAt = new Date(Date.now() + RESET_MS);
  await prisma.person.update({
    where: { email },
    data: { resetToken: token, resetExpiresAt },
  });
  return token;
}

export async function requestResetLink(email: string) {
  const existing = await prisma.person.findUnique({ where: { email } });
  const role = await roleForEmail(email);
  if (!existing && role === "Student") return null;
  const person = existing ?? (await ensurePerson(email));
  return issueResetToken(person.email);
}

export async function consumeResetToken(token: string) {
  const person = await prisma.person.findUnique({ where: { resetToken: token } });
  if (!person) return { error: "This reset link is not valid." };
  if (person.resetExpiresAt && person.resetExpiresAt.getTime() < Date.now()) {
    return { error: "This reset link has expired. Ask for a new one." };
  }
  await prisma.person.update({
    where: { email: person.email },
    data: { resetToken: null, resetExpiresAt: null },
  });
  return { email: person.email };
}
