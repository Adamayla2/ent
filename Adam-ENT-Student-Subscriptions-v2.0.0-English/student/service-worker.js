const CACHE_NAME = "adam-ent-paid-student-v2.0.0";

const STATIC_CACHE = [
  "./",
  "./index.html",
  "./about.html",
  "./privacy.html",
  "./app.js",
  "./config.js",
  "./subscription-client.js",
  "./subscription.css",
  "./paid-bootstrap.js",
  "./paid-bank.js",
  "./jszip_min.js",
  "./update-package.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key.startsWith('adam-ent-') && key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  const root = new URL('./', self.location.href);
  const allowed = new Set(STATIC_CACHE.map(name => new URL(name, root).pathname));
  // Never cache account, license, payment or question-bank API responses.
  if (url.origin !== self.location.origin || !allowed.has(url.pathname)) return;
  if (url.pathname.endsWith('/config.js')) {
    event.respondWith(fetch(event.request).then(async response => {
      if (response.ok) { const cache = await caches.open(CACHE_NAME); await cache.put(event.request, response.clone()); }
      return response;
    }).catch(() => caches.match(event.request)));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then((networkResponse) => {
            if (
              networkResponse &&
              networkResponse.status === 200 &&
              networkResponse.type === "basic"
            ) {
              const responseClone = networkResponse.clone();

              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }

            return networkResponse;
          });
      })
      .catch(() => {
        return Response.error();
      })
  );
});
