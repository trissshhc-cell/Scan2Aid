
const CACHE_NAME = "scan2aid-offline-v3";

const FILES = [
  "./",
  "./index.html",
  "./bisaya.html",
  "./style.css",
  "./app.js",
  "./images/scissors.svg",
  "./images/betadine.svg",
  "./images/gauze.svg",
  "./images/plaster.svg",
  "./images/elastic.svg"
];

// Save all website files for offline use.
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(
          FILES.map(file =>
            new Request(file, { cache: "reload" })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Remove old Scan2Aid caches.
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key =>
          key.startsWith("scan2aid-") &&
          key !== CACHE_NAME
        ).map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Load saved files even without internet.
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      const saved = await cache.match(
        event.request,
        { ignoreSearch: true }
      );

      if (saved) return saved;

      try {
        return await fetch(event.request);
      } catch (error) {
        if (event.request.mode === "navigate") {
          const page = url.pathname.endsWith("bisaya.html")
            ? "./bisaya.html"
            : "./index.html";

          const fallback = await cache.match(page);
          if (fallback) return fallback;
        }

        return Response.error();
      }
    })
  );
});
