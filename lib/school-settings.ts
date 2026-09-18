import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/db";
import { officialCampuses, officialProgrammes, SCHOOL } from "@/lib/school-identity";
import { ensureSeeded } from "@/lib/staff";

const LOGO_DIR = path.join(process.cwd(), "data");

export async function getSchoolSettings() {
  await ensureSeeded();
  const settings = await prisma.schoolSettings.findUnique({
    where: { id: "slui" },
  });
  const campuses = await prisma.campus.findMany();
  const programmes = await prisma.programme.findMany();
  return {
    universityName: settings?.universityName ?? SCHOOL.name,
    logoSrc: settings?.logoSrc ?? SCHOOL.logoSrc,
    emailEnding: settings?.emailEnding ?? "",
    campuses: officialCampuses(campuses.map((row) => row.name)),
    programmes: officialProgrammes(programmes.map((row) => row.name)),
  };
}

export async function updateSchoolSettings(patch: {
  universityName?: string;
  emailEnding?: string;
  logoDataUrl?: string;
}) {
  await ensureSeeded();
  const data: { universityName?: string; emailEnding?: string; logoSrc?: string } =
    {};
  if (patch.universityName !== undefined) {
    const name = patch.universityName.trim();
    if (!name) return { error: "University name is required." };
    data.universityName = name;
  }
  if (patch.emailEnding !== undefined) {
    data.emailEnding = patch.emailEnding.trim().replace(/^@/, "");
  }
  if (patch.logoDataUrl?.startsWith("data:image/")) {
    const match = patch.logoDataUrl.match(
      /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/,
    );
    if (!match) return { error: "That logo file could not be read." };
    const ext = match[1].includes("png") ? "png" : "jpg";
    await mkdir(LOGO_DIR, { recursive: true });
    await writeFile(
      path.join(LOGO_DIR, `school-logo.${ext}`),
      Buffer.from(match[2], "base64"),
    );
    data.logoSrc = `/api/school-logo?ext=${ext}`;
  }
  await prisma.schoolSettings.update({ where: { id: "slui" }, data });
  return { settings: await getSchoolSettings() };
}

export async function addCampus(name: string) {
  await ensureSeeded();
  const trimmed = name.trim();
  if (!trimmed) return { error: "Campus name is required." };
  await prisma.campus.upsert({
    where: { name: trimmed },
    create: { name: trimmed },
    update: {},
  });
  return { settings: await getSchoolSettings() };
}

export async function removeCampus(name: string) {
  await ensureSeeded();
  await prisma.campus.deleteMany({ where: { name } });
  return { settings: await getSchoolSettings() };
}

export async function addProgramme(name: string) {
  await ensureSeeded();
  const trimmed = name.trim();
  if (!trimmed) return { error: "Programme name is required." };
  await prisma.programme.upsert({
    where: { name: trimmed },
    create: { name: trimmed },
    update: {},
  });
  return { settings: await getSchoolSettings() };
}

export async function removeProgramme(name: string) {
  await ensureSeeded();
  await prisma.programme.deleteMany({ where: { name } });
  return { settings: await getSchoolSettings() };
}

export function nameOnCard(universityName: string) {
  return universityName.trim().toUpperCase();
}
