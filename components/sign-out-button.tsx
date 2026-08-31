"use client";

import { useRouter } from "next/navigation";

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="text-[13px] font-medium text-foreground hover:text-accent"
      onClick={async () => {
        await fetch("/api/sign-out", { method: "POST" });
        router.push("/sign-in");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
