// Service Worker for BibleAF
// Version: 2.0.0

const CACHE_NAME = "bibleaf-v2"
const OFFLINE_PAGE = "/offline.html"

// Resources to cache immediately on install
const PRECACHE_RESOURCES = [
  "/",
  OFFLINE_PAGE,
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/images/divine-light-background.png",
]

// Install event - cache critical resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching app shell and critical resources")
        return cache.addAll(PRECACHE_RESOURCES)
      })
      .then(() => self.skipWaiting())
      .catch((error) => {
        console.error("Precaching failed:", error)
      }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => {
              console.log("Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }),
        )
      })
      .then(() => {
        console.log("Service Worker activated")
        return self.clients.claim()
      })
      .catch((error) => {
        console.error("Cache cleanup failed:", error)
      }),
  )
})

// Simplified fetch event handler to avoid runtime errors
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests and browser extensions
  if (event.request.method !== "GET" || event.request.url.startsWith("chrome-extension:")) {
    return
  }

  // Basic network-first strategy with offline fallback
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response && response.status === 200) {
          const responseClone = response.clone()
          caches
            .open(CACHE_NAME)
            .then((cache) => {
              // Only cache same-origin requests
              if (new URL(event.request.url).origin === location.origin) {
                cache.put(event.request, responseClone)
              }
            })
            .catch((err) => {
              console.warn("Failed to cache response:", err)
            })
        }
        return response
      })
      .catch(() => {
        // Fallback to cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse
          }

          // For HTML navigation requests, show offline page
          if (event.request.headers.get("accept").includes("text/html")) {
            return caches.match(OFFLINE_PAGE)
          }

          // Return 404 for other resources
          return new Response("Resource not available offline", {
            status: 404,
            statusText: "Not Found",
          })
        })
      }),
  )
})

// Handle messages from the main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
