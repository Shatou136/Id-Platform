"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import {
  clearCapturedInstallPrompt,
  installFallbackHint,
  isStandaloneDisplay,
  readCapturedInstallPrompt,
  type BeforeInstallPromptEvent,
} from "@/lib/pwa";

function subscribeStandalone(onChange: () => void) {
  const media = window.matchMedia("(display-mode: standalone)");
  media.addEventListener("change", onChange);
  window.addEventListener("appinstalled", onChange);
  return () => {
    media.removeEventListener("change", onChange);
    window.removeEventListener("appinstalled", onChange);
  };
}

export function InstallAppButton() {
  const rootRef = useRef<HTMLDivElement>(null);
  const standalone = useSyncExternalStore(
    subscribeStandalone,
    isStandaloneDisplay,
    () => false,
  );
  const [helpOpen, setHelpOpen] = useState(false);
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    let cancelled = false;
    const onPrompt = (event: Event) => {
      event.preventDefault();
      const next = event as BeforeInstallPromptEvent;
      window.__sluiInstallPrompt = next;
      setPromptEvent(next);
    };
    const onInstalled = () => {
      clearCapturedInstallPrompt();
      setPromptEvent(null);
      setHelpOpen(false);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    void Promise.resolve().then(() => {
      if (cancelled) return;
      setPromptEvent(readCapturedInstallPrompt());
    });
    return () => {
      cancelled = true;
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    if (!helpOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setHelpOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setHelpOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [helpOpen]);

  if (standalone) return null;

  async function install() {
    const next = promptEvent ?? readCapturedInstallPrompt();
    if (next) {
      await next.prompt();
      const choice = await next.userChoice;
      if (choice.outcome === "accepted") {
        clearCapturedInstallPrompt();
        setPromptEvent(null);
        setHelpOpen(false);
      }
      return;
    }
    setHelpOpen((open) => !open);
  }

  return (
    <div className="relative z-40 shrink-0" ref={rootRef}>
      <Button
        type="button"
        variant="outline"
        size="sm"
        aria-expanded={helpOpen}
        aria-controls={helpOpen ? "install-app-help" : undefined}
        onClick={() => void install()}
      >
        Install App
      </Button>
      {helpOpen ? (
        <div
          id="install-app-help"
          role="note"
          className="absolute right-0 top-full z-50 mt-1.5 w-72 rounded-md border border-line bg-surface p-3 text-[13px] leading-5 text-foreground shadow-md"
        >
          {installFallbackHint()}
        </div>
      ) : null}
    </div>
  );
}
