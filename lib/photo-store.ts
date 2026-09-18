import { mkdir, readdir, unlink, writeFile, readFile } from "fs/promises";
import path from "path";

const PHOTO_DIR = path.join(process.cwd(), "data", "photos");

function extensionFor(mime: string) {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "jpg";
}

export function photoUrl(requestId: string, ext: string) {
  return `/api/photos/${requestId}.${ext}`;
}

async function persistPhotoLocal(requestId: string, mime: string, bytes: Buffer) {
  const ext = extensionFor(mime);
  await mkdir(PHOTO_DIR, { recursive: true });
  const files = await readdir(PHOTO_DIR).catch(() => [] as string[]);
  await Promise.all(
    files
      .filter((name) => name.startsWith(`${requestId}.`))
      .map((name) => unlink(path.join(PHOTO_DIR, name))),
  );
  await writeFile(path.join(PHOTO_DIR, `${requestId}.${ext}`), bytes);
  return photoUrl(requestId, ext);
}

export async function persistPhoto(requestId: string, photoSrc: string) {
  if (!photoSrc.startsWith("data:")) return photoSrc;
  const match = photoSrc.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);
  if (!match) return photoSrc;
  const mime = match[1];
  const bytes = Buffer.from(match[2], "base64");
  return persistPhotoLocal(requestId, mime, bytes);
}

async function readPhotoLocal(safe: string) {
  try {
    const bytes = await readFile(path.join(PHOTO_DIR, safe));
    const ext = path.extname(safe).toLowerCase();
    const type =
      ext === ".png"
        ? "image/png"
        : ext === ".webp"
          ? "image/webp"
          : ext === ".gif"
            ? "image/gif"
            : "image/jpeg";
    return { bytes, type };
  } catch {
    return null;
  }
}

export async function readPhoto(filename: string) {
  const safe = path.basename(filename);
  if (!/^[0-9a-f-]+\.(jpg|jpeg|png|webp|gif)$/i.test(safe)) return null;
  return readPhotoLocal(safe);
}

export function requestIdFromPhotoName(filename: string) {
  return path.basename(filename).replace(/\.[^.]+$/, "");
}
