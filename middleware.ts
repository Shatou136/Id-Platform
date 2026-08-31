import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth-constants";

function secretKey() {
  const secret = process.env.SESSION_SECRET ?? "dev-only-slui-session-secret";
  return new TextEncoder().encode(secret);
}

async function sessionFrom(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    const email = String(payload.email ?? "");
    const role =
      payload.role === "Super Admin"
        ? "Super Admin"
        : payload.role === "Admin"
          ? "Admin"
          : "Student";
    if (!email) return null;
    return { email, role };
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await sessionFrom(request);

  if (pathname === "/sign-in" || pathname === "/forgot-password") {
    if (!session) return NextResponse.next();
    const dest = session.role === "Student" ? "/student" : "/admin";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  const studentArea = pathname === "/student" || pathname.startsWith("/student/");
  const settingsArea =
    pathname === "/settings" || pathname.startsWith("/settings/");
  const adminArea =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/print";

  if (!studentArea && !adminArea && !settingsArea) return NextResponse.next();

  if (!session) {
    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("next", pathname);
    return NextResponse.redirect(signIn);
  }

  const staff = session.role === "Admin" || session.role === "Super Admin";
  if (studentArea && session.role !== "Student") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  if (adminArea && !staff) {
    return NextResponse.redirect(new URL("/student", request.url));
  }
  if (settingsArea && session.role !== "Super Admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/sign-in",
    "/forgot-password",
    "/student/:path*",
    "/admin/:path*",
    "/print",
    "/settings",
    "/settings/:path*",
  ],
};
