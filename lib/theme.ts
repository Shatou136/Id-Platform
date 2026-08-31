export type ColorMode = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "slui-color-mode";

export function isColorMode(value: string | null): value is ColorMode {
  return value === "light" || value === "dark" || value === "system";
}

export function resolvedDark(mode: ColorMode) {
  if (mode === "dark") return true;
  if (mode === "light") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyColorMode(mode: ColorMode) {
  const dark = resolvedDark(mode);
  document.documentElement.classList.toggle("dark", dark);
  document.documentElement.dataset.theme = mode;
  document.documentElement.style.colorScheme = dark ? "dark" : "light";
}
