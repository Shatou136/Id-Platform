"use client";

import { useCallback, useEffect, useState } from "react";
import {
  pushSupported,
  subscribeToPings,
  unsubscribeFromPings,
} from "@/lib/push-client";

type Permission = NotificationPermission | "unsupported";

export function PhonePingSwitch() {
  const [subscribed, setSubscribed] = useState(false);
  const [permission, setPermission] = useState<Permission>("default");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    if (!pushSupported()) {
      setPermission("unsupported");
      setReady(true);
      return;
    }
    setPermission(Notification.permission);
    const response = await fetch("/api/pings");
    if (response.ok) {
      const data = (await response.json()) as { subscribed?: boolean };
      setSubscribed(Boolean(data.subscribed));
    }
    setReady(true);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const blocked = permission === "denied";
  const unsupported = permission === "unsupported";
  const on = subscribed && permission === "granted";
  const canToggle = ready && !unsupported && !blocked && !busy;

  async function toggle() {
    if (!canToggle) return;
    setBusy(true);
    setError("");
    try {
      if (on) {
        const result = await unsubscribeFromPings();
        if (!result.ok) {
          setError(result.error ?? "Could not turn phone pings off.");
          return;
        }
        setSubscribed(false);
      } else {
        const result = await subscribeToPings();
        setPermission(
          pushSupported() ? Notification.permission : "unsupported",
        );
        if (!result.ok) {
          setError(result.error ?? "Could not turn phone pings on.");
          setSubscribed(false);
          return;
        }
        setSubscribed(true);
        await fetch("/api/pings", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "test" }),
        });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-md border border-line bg-surface px-4 py-3">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[15px] font-semibold">Phone pings</p>
          <p className="mt-0.5 text-[13px] leading-5 text-muted">
            {blocked
              ? "Blocked on this device. Allow them in the browser site settings, or rely on Email."
              : unsupported
                ? "This device cannot receive phone pings. Open the app over HTTPS, or rely on Email."
                : on
                  ? "On. You will get a ping on this device."
                  : "Off. Turn on to get a ping on this phone."}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={on}
          aria-label={on ? "Turn phone pings off" : "Turn phone pings on"}
          disabled={!canToggle}
          onClick={() => void toggle()}
          className="ping-switch"
        >
          <span className="ping-switch__knob" />
        </button>
      </div>
      {error ? (
        <p className="mt-2 text-[13px] font-medium text-accent">{error}</p>
      ) : null}
    </div>
  );
}
