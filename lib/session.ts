import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth-constants";
import { normalizeEmail, parseRole, roleForEmail, type Role } from "@/lib/staff";

export { SESSION_COOKIE };

export type Session = {
  email: string;
  role: Role;
};

function secretKey() {
  const secret = process.env.SESSION_SECRET ?? "dev-only-slui-session-secret";
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(email: string) {
  const normalized = normalizeEmail(email);
  return new SignJWT({
    email: normalized,
    role: await roleForEmail(normalized),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(secretKey());
}

export async function readSession(): Promise<Session | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const email = String(payload.email ?? "");
    const role = parseRole(payload.role);
    if (!email) return null;
    return { email, role };
  } catch {
    return null;
  }
}

export async function writeSession(email: string) {
  const token = await createSessionToken(email);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
