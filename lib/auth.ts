import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { APIError } from "better-auth/api";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { appOriginFromEnv, sendResetMail } from "@/lib/mail";
import { ensurePerson } from "@/lib/person";

const pendingResetPaths = new Map<string, string>();

function authSecret() {
  return (
    process.env.BETTER_AUTH_SECRET ??
    process.env.SESSION_SECRET ??
    "dev-only-slui-better-auth-secret!!"
  );
}

function authBaseURL() {
  return appOriginFromEnv() ?? "http://localhost:3000";
}

export const auth = betterAuth({
  secret: authSecret(),
  baseURL: authBaseURL(),
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false,
    autoSignIn: true,
    sendResetPassword: async ({ user, token }) => {
      const path = `/reset/${token}`;
      pendingResetPaths.set(user.email.toLowerCase(), path);
      await sendResetMail(user.email, `${authBaseURL()}${path}`);
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 14,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  trustedOrigins: [authBaseURL()],
  advanced: {
    database: {
      validateSchema: false,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await ensurePerson(user.email);
        },
      },
    },
  },
  plugins: [nextCookies()],
});

export function takeResetPath(email: string) {
  const key = email.trim().toLowerCase();
  const path = pendingResetPaths.get(key) ?? null;
  pendingResetPaths.delete(key);
  return path;
}

export function messageFromAuthError(error: unknown, fallback: string) {
  if (error instanceof APIError && error.message) return error.message;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export async function signInWithPassword(email: string, password: string) {
  const requestHeaders = await headers();
  try {
    await auth.api.signInEmail({
      body: { email, password },
      headers: requestHeaders,
    });
    return { ok: true as const };
  } catch {
    return {
      ok: false as const,
      error:
        "Could not sign in. Check your Email and password, or sign up.",
    };
  }
}

export async function signUpWithPassword(
  email: string,
  password: string,
  name: string,
) {
  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return {
        ok: false as const,
        error: "This Email is already in use. Sign in instead.",
      };
    }
  } catch {
    return {
      ok: false as const,
      error: "Could not sign up. Try again in a moment.",
    };
  }

  const requestHeaders = await headers();
  try {
    await auth.api.signUpEmail({
      body: { email, password, name },
      headers: requestHeaders,
    });
    return { ok: true as const };
  } catch (error) {
    const message = messageFromAuthError(error, "Could not sign up.");
    if (/already|exist/i.test(message)) {
      return {
        ok: false as const,
        error: "This Email is already in use. Sign in instead.",
      };
    }
    return { ok: false as const, error: message };
  }
}
