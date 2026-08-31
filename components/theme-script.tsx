import { THEME_STORAGE_KEY } from "@/lib/theme";

const script = `(() => {
  try {
    const stored = localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
    const mode = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
    const dark = mode === "dark" || (mode === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.dataset.theme = mode;
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  } catch {}
})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
