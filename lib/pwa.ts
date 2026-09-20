export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

declare global {
  interface Window {
    __sluiInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

export function pwaSupported() {
  return (
    typeof window !== "undefined" &&
    window.isSecureContext &&
    "serviceWorker" in navigator
  );
}

export function isStandaloneDisplay() {
  if (typeof window === "undefined") return false;
  const media = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone = Boolean(
    "standalone" in navigator &&
      (navigator as Navigator & { standalone?: boolean }).standalone,
  );
  return media || iosStandalone;
}

export function readCapturedInstallPrompt() {
  if (typeof window === "undefined") return null;
  return window.__sluiInstallPrompt ?? null;
}

export function clearCapturedInstallPrompt() {
  if (typeof window === "undefined") return;
  window.__sluiInstallPrompt = null;
}

export function installFallbackHint() {
  if (typeof navigator === "undefined") {
    return "Use the install icon in the address bar, or the browser menu: Install SLUI ID.";
  }
  const ua = navigator.userAgent;
  const iPadOs =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  if (/iphone|ipad|ipod/i.test(ua) || iPadOs) {
    return "On iPhone or iPad, tap Share, then Add to Home Screen.";
  }
  if (/android/i.test(ua) && /firefox/i.test(ua)) {
    return "Open the Firefox menu, then tap Install.";
  }
  if (/android/i.test(ua) && /samsungbrowser/i.test(ua)) {
    return "Open the Samsung Internet menu, then Add page to, then Home screen.";
  }
  if (/edg/i.test(ua)) {
    return "Open the Edge menu, then Apps, then Install this site as an app. You can also use the install icon in the address bar.";
  }
  if (
    /safari/i.test(ua) &&
    /macintosh/i.test(ua) &&
    !/chrome|chromium|crios|edg|android/i.test(ua)
  ) {
    return "In Safari on a Mac, open File, then Add to Dock.";
  }
  return "Use the install icon in the address bar, or open the Chrome menu and choose Install page as an app / Install app.";
}

export function registerServiceWorker() {
  if (!pwaSupported()) return Promise.resolve(null);
  return navigator.serviceWorker
    .register("/sw.js", { scope: "/", updateViaCache: "none" })
    .catch(() => null);
}
