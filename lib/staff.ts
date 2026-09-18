import { prisma } from "@/lib/db";
import {
  PHOTOGRAPHED_PROGRAMME_SEED,
  SCHOOL,
  SEED_CAMPUSES,
  SEED_PROGRAMMES,
} from "@/lib/school-identity";

export type StaffRole = "Admin" | "Super Admin";
export type Role = "Student" | StaffRole;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isStaff(role: string | null | undefined): role is StaffRole {
  return role === "Admin" || role === "Super Admin";
}

export function parseRole(value: unknown): Role {
  if (value === "Super Admin") return "Super Admin";
  if (value === "Admin") return "Admin";
  return "Student";
}

function envAdminEmails(): string[] {
  const raw = process.env.SLUI_ADMIN_EMAILS ?? "admin@slui.org";
  return raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

export async function ensureSeeded() {
  const staffCount = await prisma.staff.count();
  if (staffCount === 0) {
    const emails = envAdminEmails();
    const first = emails[0] ?? "admin@slui.org";
    await prisma.staff.create({
      data: { email: first, role: "Super Admin" },
    });
    for (const email of emails.slice(1)) {
      await prisma.staff.create({ data: { email, role: "Admin" } });
    }
  }
  const settings = await prisma.schoolSettings.findUnique({
    where: { id: "slui" },
  });
  if (!settings) {
    await prisma.schoolSettings.create({
      data: {
        id: "slui",
        universityName: SCHOOL.name,
        logoSrc: SCHOOL.logoSrc,
        emailEnding: "",
      },
    });
  }
  await seedCampuses();
  await seedProgrammes();
}

async function seedCampuses() {
  await prisma.campus.createMany({
    data: SEED_CAMPUSES.map((name) => ({ name })),
    skipDuplicates: true,
  });
}

async function seedProgrammes() {
  await prisma.programme.createMany({
    data: SEED_PROGRAMMES.map((name) => ({ name })),
    skipDuplicates: true,
  });
  await prisma.programme.deleteMany({
    where: { name: PHOTOGRAPHED_PROGRAMME_SEED },
  });
  await prisma.request.updateMany({
    where: { programme: PHOTOGRAPHED_PROGRAMME_SEED },
    data: { programme: "HND SOFTWARE ENGINEERING" },
  });
}

export async function roleForEmail(email: string): Promise<Role> {
  await ensureSeeded();
  const staff = await prisma.staff.findUnique({
    where: { email: normalizeEmail(email) },
  });
  if (!staff) return "Student";
  return staff.role === "Super Admin" ? "Super Admin" : "Admin";
}

export async function listStaff() {
  await ensureSeeded();
  return prisma.staff.findMany({ orderBy: { email: "asc" } });
}

export async function addStaff(email: string, role: StaffRole) {
  await ensureSeeded();
  const normalized = normalizeEmail(email);
  if (!normalized.includes("@")) return { error: "Enter a valid Email." };
  await prisma.staff.upsert({
    where: { email: normalized },
    create: { email: normalized, role },
    update: { role },
  });
  return { ok: true };
}

export async function removeStaff(email: string) {
  await ensureSeeded();
  const normalized = normalizeEmail(email);
  const target = await prisma.staff.findUnique({ where: { email: normalized } });
  if (!target) return { error: "That Email is not on the Admin list." };
  if (target.role === "Super Admin") {
    const supers = await prisma.staff.count({ where: { role: "Super Admin" } });
    if (supers <= 1) {
      return { error: "The last Super Admin cannot be removed." };
    }
  }
  await prisma.staff.delete({ where: { email: normalized } });
  return { ok: true };
}
