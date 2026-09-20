const CACHE_VERSION = "slui-id-v4";

const PRECACHE = [
  "/offline",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
  "/logo.jpg",
];

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function isLocalDevHost() {
  const host = self.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

function shouldBypass(url) {
  if (!isSameOrigin(url)) return true;
  if (url.pathname.startsWith("/api/")) return true;
  if (url.pathname.startsWith("/_next/webpack")) return true;
  if (url.pathname.startsWith("/_next/hmr")) return true;
  if (url.pathname.includes("hot-update")) return true;
  if (url.searchParams.has("_rsc")) return true;
  // Keep Next.js Fast Refresh intact while still meeting installability
  // on http://localhost:3000 (Chrome treats localhost as a secure context).
  if (isLocalDevHost() && url.pathname.startsWith("/_next/")) return true;
  return false;
}

function isPublicAsset(url) {
  return (
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/logo.jpg" ||
    url.pathname === "/manifest.webmanifest" ||
    /\.(?:png|jpg|jpeg|svg|webp|ico|woff2?)$/i.test(url.pathname)
  );
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error("timeout")), ms);
    }),
  ]);
}

async function precache() {
  const cache = await caches.open(CACHE_VERSION);
  await Promise.all(
    PRECACHE.map((url) =>
      withTimeout(cache.add(url), 8000).catch(() => undefined),
    ),
  );
}

async function dropOldCaches() {
  const keys = await caches.keys();
  await Promise.all(
    keys
      .filter((key) => key !== CACHE_VERSION)
      .map((key) => caches.delete(key)),
  );
}

async function fromCache(request) {
  return caches.match(request);
}

async function putInCache(request, response) {
  if (!response || !response.ok) return;
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("text/x-component")) return;
  const cache = await caches.open(CACHE_VERSION);
  await cache.put(request, response.clone());
}

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    await putInCache(request, response);
    return response;
  } catch {
    const cached = await fromCache(request);
    if (cached) return cached;
    if (request.mode === "navigate") {
      const offline = await caches.match("/offline");
      if (offline) return offline;
    }
    return Response.error();
  }
}

async function cacheFirst(request) {
  const cached = await fromCache(request);
  if (cached) return cached;
  return networkFirst(request);
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        await precache();
      } finally {
        await self.skipWaiting();
      }
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(dropOldCaches().then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (shouldBypass(url)) return;
  event.respondWith(
    isPublicAsset(url) ? cacheFirst(event.request) : networkFirst(event.request),
  );
});

self.addEventListener("push", (event) => {
  let payload = {
    title: "Student ID Cards",
    body: "",
    url: "/student",
  };
  try {
    payload = { ...payload, ...event.data.json() };
  } catch {
    if (event.data) payload.body = event.data.text();
  }
  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: { url: payload.url || "/student" },
    }),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/student";
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windows) => {
        const existing = windows.find((client) => client.url.includes(url));
        if (existing && "focus" in existing) return existing.focus();
        return self.clients.openWindow(url);
      }),
  );
});
