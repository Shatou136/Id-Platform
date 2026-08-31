import Link from "next/link";
import { StaffHeaderBack } from "@/components/admin-back-button";
import { SignOutButton } from "@/components/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SCHOOL } from "@/lib/school-identity";

type AppShellProps = {
  role?: "Student" | "Admin" | "Super Admin";
  children: React.ReactNode;
};

export function AppShell({ role, children }: AppShellProps) {
  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <header className="relative z-20 overflow-visible border-b border-line bg-surface">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <StaffHeaderBack />
            <Link href="/" className="flex items-center gap-3 no-underline">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SCHOOL.logoSrc}
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 object-contain"
              />
              <span className="flex flex-col leading-tight">
                <span className="text-[15px] font-semibold tracking-tight">
                  {SCHOOL.name}
                </span>
                <span className="text-[13px] text-muted">
                  Student ID Cards{role ? ` · ${role}` : ""}
                </span>
              </span>
            </Link>
          </div>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-medium">
            {role === "Student" ? (
              <Link className="text-foreground hover:text-accent" href="/student">
                Your Request
              </Link>
            ) : null}
            {role === "Admin" || role === "Super Admin" ? (
              <>
                <Link className="text-foreground hover:text-accent" href="/admin">
                  Requests
                </Link>
                <Link
                  className="text-foreground hover:text-accent"
                  href="/print/preview"
                >
                  Card template
                </Link>
              </>
            ) : null}
            {role === "Super Admin" ? (
              <Link className="text-foreground hover:text-accent" href="/settings">
                Settings
              </Link>
            ) : null}
            {role ? <SignOutButton /> : (
              <Link className="text-foreground hover:text-accent" href="/sign-in">
                Sign in
              </Link>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
