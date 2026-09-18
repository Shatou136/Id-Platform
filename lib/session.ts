import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { normalizeEmail, roleForEmail, type Role } from "@/lib/staff";

export type Session = {
  email: string;
  role: Role;
};

export async function readSession(): Promise<Session | null> {
  try {
    const result = await auth.api.getSession({
      headers: await headers(),
    });
    const email = result?.user?.email;
    if (!email) return null;
    const normalized = normalizeEmail(email);
    return { email: normalized, role: await roleForEmail(normalized) };
  } catch {
    return null;
  }
}

export async function clearSession() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
  } catch {
    // Browser is still signed out of this app if the cookie is gone.
  }
}
