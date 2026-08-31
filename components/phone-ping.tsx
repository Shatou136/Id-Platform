"use client";

import { useEffect, useState } from "react";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function PhonePing() {
  const [status, setStatus] = useState<"off" | "on" | "blocked" | "hidden">(
    "hidden",
  );

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
      await navigator.serviceWorker.register("/sw.js");
      if (cancelled) return;
      if (Notification.permission === "denied") {
        setStatus("blocked");
        return;
      }
      if (Notification.permission === "granted") {
        const ok = await subscribe();
        if (!cancelled) setStatus(ok ? "on" : "off");
        return;
      }
      setStatus("off");
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "hidden" || status === "on") return null;

  if (status === "blocked") {
    return (
      <p className="mt-4 text-[13px] leading-5 text-muted">
        Phone pings are blocked on this device. Email is the backup.
      </p>
    );
  }

  return (
    <button
      type="button"
      className="mt-4 rounded-md border border-input-border bg-surface px-3 py-2 text-[14px] font-medium"
      onClick={async () => {
        const ok = await subscribe();
        setStatus(ok ? "on" : Notification.permission === "denied" ? "blocked" : "off");
      }}
    >
      Allow phone pings
    </button>
  );
}

async function subscribe() {
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return false;
  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;
  const keyResponse = await fetch("/api/push/public-key");
  const { publicKey } = (await keyResponse.json()) as { publicKey?: string };
  if (!publicKey) return false;
  const existing = await registration.pushManager.getSubscription();
  const subscription =
    existing ??
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    }));
  const saved = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription),
  });
  return saved.ok;
}
