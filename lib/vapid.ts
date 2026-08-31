import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import webpush from "web-push";

type VapidKeys = { publicKey: string; privateKey: string };

const VAPID_FILE = path.join(process.cwd(), "data", "vapid.json");

export async function vapidKeys(): Promise<VapidKeys> {
  if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    return {
      publicKey: process.env.VAPID_PUBLIC_KEY,
      privateKey: process.env.VAPID_PRIVATE_KEY,
    };
  }
  try {
    const stored = JSON.parse(await readFile(VAPID_FILE, "utf8")) as VapidKeys;
    if (stored.publicKey && stored.privateKey) return stored;
  } catch {
    // first run
  }
  const generated = webpush.generateVAPIDKeys();
  await mkdir(path.dirname(VAPID_FILE), { recursive: true });
  await writeFile(VAPID_FILE, JSON.stringify(generated, null, 2));
  return generated;
}

export async function configureWebPush() {
  const keys = await vapidKeys();
  webpush.setVapidDetails("mailto:info@slui.org", keys.publicKey, keys.privateKey);
  return keys;
}
