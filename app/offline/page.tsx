import Link from "next/link";
import { SCHOOL } from "@/lib/school-identity";

export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <div className="flex min-h-full flex-col items-center bg-background px-4 pt-16 text-center text-foreground sm:pt-24">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={SCHOOL.logoSrc}
        alt=""
        width={44}
        height={44}
        className="h-11 w-11 object-contain"
      />
      <h1 className="mt-6 text-2xl font-semibold tracking-tight">
        You are offline
      </h1>
      <p className="mt-2 max-w-md text-[15px] leading-6 text-muted">
        Student ID Cards needs a connection to send a Request or check its
        status. Reconnect, then try again.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex rounded-md bg-accent px-4 py-3 text-[15px] font-semibold text-white"
      >
        Try again
      </Link>
    </div>
  );
}
