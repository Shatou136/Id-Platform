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
      <div className="mx-auto max-w-xl pt-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          Student ID Cards
        </h1>
        <p className="mt-2 text-[15px] leading-6 text-muted">
          {SCHOOL.name} prints Student ID Cards in house. Sign in to send a
          Request or to check, Print, mark Arrival, and Pickup.
        </p>
        <Link
          href="/sign-in"
          className="mt-6 inline-flex rounded-md bg-accent px-4 py-3 text-[15px] font-semibold text-white"
        >
          Sign in
        </Link>
      </div>
    </AppShell>
  );
}
