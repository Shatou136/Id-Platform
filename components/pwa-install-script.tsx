const script = `(() => {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    window.__sluiInstallPrompt = event;
  });
  window.addEventListener("appinstalled", () => {
    window.__sluiInstallPrompt = null;
  });
})();`;

export function PwaInstallScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
