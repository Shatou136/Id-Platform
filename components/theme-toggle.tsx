"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  applyColorMode,
  isColorMode,
  THEME_STORAGE_KEY,
  type ColorMode,
} from "@/lib/theme";

const OPTIONS: { mode: ColorMode; label: string }[] = [
  { mode: "light", label: "Light" },
  { mode: "dark", label: "Dark" },
  { mode: "system", label: "System" },
];

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="theme-toggle__icon">
      <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.75" />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.75"
        d="M12 3v1.5M12 19.5V21M4.93 4.93l1.06 1.06M18.01 18.01l1.06 1.06M3 12h1.5M19.5 12H21M4.93 19.07l1.06-1.06M18.01 5.99l1.06-1.06"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="theme-toggle__icon">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
        d="M20 14.5A8.5 8.5 0 1 1 9.5 4 7 7 0 0 0 20 14.5Z"
      />
    </svg>
  );
}

function SystemIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="theme-toggle__icon">
      <rect
        x="3.5"
        y="4.5"
        width="17"
        height="12"
        rx="1.75"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.75"
        d="M8 19.5h8M12 16.5V19.5"
      />
    </svg>
  );
}

function OptionIcon({ mode }: { mode: ColorMode }) {
  if (mode === "dark") return <MoonIcon />;
  if (mode === "system") return <SystemIcon />;
  return <SunIcon />;
}

export function ThemeToggle() {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<ColorMode>("system");
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const next = isColorMode(stored) ? stored : "system";
    applyColorMode(next);
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const syncAppearance = () => {
      setDark(document.documentElement.classList.contains("dark"));
    };
    const onChange = () => {
      const current = localStorage.getItem(THEME_STORAGE_KEY);
      if (current === "system" || !isColorMode(current)) applyColorMode("system");
      syncAppearance();
    };
    media.addEventListener("change", onChange);
    void Promise.resolve().then(() => {
      setMode(next);
      syncAppearance();
    });
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  function choose(next: ColorMode) {
    setMode(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
    applyColorMode(next);
    setDark(document.documentElement.classList.contains("dark"));
    setOpen(false);
  }

  return (
    <div className="theme-toggle" ref={rootRef}>
      <button
        type="button"
        className="theme-toggle__button"
        aria-label="Color"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {dark ? <MoonIcon /> : <SunIcon />}
      </button>
      {open ? (
        <div className="theme-toggle__menu" id={menuId} role="menu" aria-label="Color">
          {OPTIONS.map((option) => (
            <button
              key={option.mode}
              type="button"
              role="menuitemradio"
              aria-checked={mode === option.mode}
              className="theme-toggle__option"
              onClick={() => choose(option.mode)}
            >
              <OptionIcon mode={option.mode} />
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
