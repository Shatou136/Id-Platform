function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob((base64 + padding).replace(/-/g, "+").replace(/_/g, "/"));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export type PushResult = { ok: boolean; error?: string };

export function pushSupported() {
  return (
    typeof window !== "undefined" &&
    window.isSecureContext &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export async function registerPushWorker() {
  if (!pushSupported()) return null;
  return navigator.serviceWorker.register("/sw.js", { scope: "/" });
}

export async function subscribeToPings(): Promise<PushResult> {
  if (!pushSupported()) {
    return {
      ok: false,
      error: "This device cannot receive phone pings. Use HTTPS, or Email as the backup.",
    };
  }
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return {
      ok: false,
      error:
        permission === "denied"
          ? "Phone pings are blocked on this device. Allow them in the browser site settings."
          : "Allow phone pings to turn them on.",
    };
  }
  try {
    const registration = await registerPushWorker();
    if (!registration) {
      return { ok: false, error: "Could not start phone pings on this device." };
    }
    await navigator.serviceWorker.ready;
    const keyResponse = await fetch("/api/push/public-key");
    const { publicKey } = (await keyResponse.json()) as { publicKey?: string };
    if (!keyResponse.ok || !publicKey) {
      return { ok: false, error: "Could not start phone pings." };
    }
    const existing = await registration.pushManager.getSubscription();
    if (existing) await existing.unsubscribe();
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
    const saved = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription.toJSON()),
    });
    if (!saved.ok) {
      const data = (await saved.json().catch(() => ({}))) as { error?: string };
      return { ok: false, error: data.error ?? "Could not save phone pings." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not start phone pings on this device." };
  }
}

export async function unsubscribeFromPings(): Promise<PushResult> {
  try {
    if (pushSupported()) {
      const registration = await navigator.serviceWorker.ready.catch(() => null);
      const existing = await registration?.pushManager.getSubscription();
      if (existing) await existing.unsubscribe();
    }
    const response = await fetch("/api/push/subscribe", { method: "DELETE" });
    if (!response.ok && response.status !== 401) {
      return { ok: false, error: "Could not turn phone pings off." };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not turn phone pings off." };
  }
}
