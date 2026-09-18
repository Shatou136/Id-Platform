import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { readSession } from "@/lib/session";
import { SCHOOL } from "@/lib/school-identity";
import Link from "next/link";

export default async function Home() {
  const session = await readSession();
  if (session?.role === "Admin" || session?.role === "Super Admin") {
    redirect("/admin");
  }
  if (session?.role === "Student") redirect("/student");

  return (
    <AppShell>
      <div className="flex flex-1 flex-col items-center pt-16 text-center sm:pt-24">
        <div className="max-w-md">
          <h1 className="text-2xl font-semibold tracking-tight">
            Student ID Cards
          </h1>
          <p className="mt-2 text-[15px] leading-6 text-muted">
            {SCHOOL.name} prints Student ID Cards in house. Sign up, then sign
            in to send a Request or to check, Print, mark Arrival, and Pickup.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/sign-in"
              className="inline-flex rounded-md bg-accent px-4 py-3 text-[15px] font-semibold text-white"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex rounded-md border border-input-border bg-surface px-4 py-3 text-[15px] font-semibold text-foreground hover:border-accent"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
