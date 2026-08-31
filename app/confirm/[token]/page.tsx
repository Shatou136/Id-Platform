import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { confirmEmail } from "@/lib/person";

export default async function ConfirmPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const result = await confirmEmail(token);

  return (
    <AppShell>
      <div className="mx-auto max-w-md pt-6">
        <h1 className="text-2xl font-semibold tracking-tight">
          {result.error ? "Confirm link" : "Email confirmed"}
        </h1>
        <p className="mt-2 text-[15px] leading-6 text-muted">
          {result.error ??
            "Your Email is confirmed. You can send a Request."}
        </p>
        <Link
          href={result.error ? "/sign-in" : "/student"}
          className="mt-6 inline-flex rounded-md bg-accent px-4 py-2.5 text-[15px] font-semibold text-white"
        >
          {result.error ? "Sign in" : "Continue"}
        </Link>
      </div>
    </AppShell>
  );
}
