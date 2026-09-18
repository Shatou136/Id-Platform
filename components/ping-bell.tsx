"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { registerPushWorker } from "@/lib/push-client";

export function PingBell() {
  const pathname = usePathname();
  const [unread, setUnread] = useState(0);

  const refresh = useCallback(async () => {
    const response = await fetch("/api/pings");
    if (!response.ok) return;
    const data = (await response.json()) as { unreadCount?: number };
    setUnread(data.unreadCount ?? 0);
  }, []);

  useEffect(() => {
    void registerPushWorker();
    void refresh();
    const onFocus = () => {
      void refresh();
    };
    window.addEventListener("focus", onFocus);
    const timer = window.setInterval(() => {
      void refresh();
    }, 20000);
    return () => {
      window.removeEventListener("focus", onFocus);
      window.clearInterval(timer);
    };
  }, [refresh]);

  const shown = pathname === "/pings" ? 0 : unread;
  const label = shown > 0 ? `Pings, ${shown} unread` : "Pings";
  const badge = shown > 9 ? "9+" : String(shown);

  return (
    <span className="ping-bell">
      <Link href="/pings" className="ping-bell__button" aria-label={label} title="Pings">
        <Bell className="theme-toggle__icon" strokeWidth={1.75} />
      </Link>
      {shown > 0 ? (
        <span className="ping-bell__badge" aria-hidden="true">
          {badge}
        </span>
      ) : null}
    </span>
  );
}
