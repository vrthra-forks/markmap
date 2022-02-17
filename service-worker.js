const timestamp = 1645092924116;
const build = [
  "/_app/start-1869297a.js",
  "/_app/assets/start-d5b4de3e.css",
  "/_app/pages/__layout.svelte-648c87bf.js",
  "/_app/assets/pages/__layout.svelte-7fbfffa2.css",
  "/_app/pages/__error.svelte-2c533e8a.js",
  "/_app/assets/pages/__error.svelte-153d5994.css",
  "/_app/pages/index.svelte-2e74b4b5.js",
  "/_app/pages/usage.svelte-e7af2e0e.js",
  "/_app/pages/docs.svelte-f323aeaf.js",
  "/_app/pages/full.svelte-2bb6834d.js",
  "/_app/pages/repl.svelte-b4018a0b.js",
  "/_app/chunks/vendor-76a7eba6.js",
  "/_app/chunks/singletons-12a22614.js",
  "/_app/chunks/preload-helper-ec9aa979.js",
  "/_app/chunks/ga-82736149.js",
  "/_app/chunks/toast-dea46e40.js",
  "/_app/chunks/markmap-22b6b98e.js",
  "/_app/chunks/footer-138af798.js",
  "/_app/chunks/loader-c37c9bae.js",
  "/_app/assets/loader-120c1b54.css",
  "/_app/chunks/buttons.esm-e71981f0.js",
  "/_app/chunks/codemirror-6c4e74cf.js",
  "/_app/assets/codemirror-ee8e2740.css"
];
const files = [
  "/.nojekyll",
  "/demos/auto-loader.html",
  "/favicon.png",
  "/logo-192.png",
  "/logo-512.png",
  "/manifest.json"
];
const ASSETS = `cache${timestamp}`;
const to_cache = build.concat(files);
const cached = new Set(to_cache);
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(ASSETS).then((cache) => cache.addAll(to_cache)).then(() => {
    self.skipWaiting();
  }));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then(async (keys) => {
    for (const key of keys) {
      if (key !== ASSETS)
        await caches.delete(key);
    }
    self.clients.claim();
  }));
});
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || event.request.headers.has("range"))
    return;
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith("http"))
    return;
  if (url.hostname === self.location.hostname && url.port !== self.location.port)
    return;
  if (url.host === self.location.host && cached.has(url.pathname)) {
    event.respondWith(caches.match(event.request, { ignoreSearch: true }));
    return;
  }
  if (event.request.cache === "only-if-cached")
    return;
  event.respondWith(caches.open(`offline${timestamp}`).then(async (cache) => {
    try {
      const response = await fetch(event.request);
      cache.put(event.request, response.clone());
      return response;
    } catch (err) {
      const response = await cache.match(event.request);
      if (response)
        return response;
      throw err;
    }
  }));
});
