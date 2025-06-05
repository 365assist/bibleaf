const CACHE_NAME = "bibleaf-v3"
const DYNAMIC_CACHE = "bibleaf-dynamic-v2"
const OFFLINE_CACHE = "bibleaf-offline-v1"
const AI_CACHE = "bibleaf-ai-v1"

// Enhanced caching strategies
const CACHE_STRATEGIES = {
  // Critical app shell files - cache first
  SHELL: [
    "/",
    "/offline.html",
    "/manifest.json",
    "/icons/icon-192x192.png",
    "/icons/icon-384x384.png",
    "/icons/icon-512x512.png",
  ],

  // Bible data - stale while revalidate
  BIBLE_DATA: ["/api/bible/stats", "/api/bible/translations", "/api/bible/books"],

  // Static assets - cache first with long TTL
  STATIC: /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/,

  // API routes that can be cached
  CACHEABLE_API: /^\/api\/(bible|ai)\//,

  // Routes that need network first
  NETWORK_FIRST: /^\/api\/(auth|payment|user)\//,
}

// Install event - cache critical resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      // Cache app shell
      caches
        .open(CACHE_NAME)
        .then((cache) => {
          console.log("Caching app shell")
          return cache.addAll(CACHE_STRATEGIES.SHELL)
        }),

      // Cache Bible data
      caches
        .open(DYNAMIC_CACHE)
        .then((cache) => {
          console.log("Caching Bible data")
          return Promise.all(
            CACHE_STRATEGIES.BIBLE_DATA.map((url) =>
              fetch(url)
                .then((response) => {
                  if (response.ok) {
                    return cache.put(url, response)
                  }
                })
                .catch((err) => console.warn(`Failed to cache ${url}: ${err}`)),
            ),
          )
        }),

      // Cache offline fallbacks
      caches
        .open(OFFLINE_CACHE)
        .then((cache) => {
          return cache.add("/offline.html")
        }),
    ]).then(() => {
      console.log("Service worker installed successfully")
      return self.skipWaiting()
    }),
  )
})

// Activate event - cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![CACHE_NAME, DYNAMIC_CACHE, OFFLINE_CACHE, AI_CACHE].includes(cacheName)) {
              console.log("Deleting old cache:", cacheName)
              return caches.delete(cacheName)
            }
          }),
        )
      })
      .then(() => {
        console.log("Service worker activated")
        return self.clients.claim()
      }),
  )
})

// Enhanced fetch event with multiple caching strategies
self.addEventListener("fetch", (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== "GET" || url.protocol === "chrome-extension:") {
    return
  }

  // Handle different types of requests
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(handleAPIRequest(request))
  } else if (CACHE_STRATEGIES.STATIC.test(url.pathname)) {
    event.respondWith(handleStaticAsset(request))
  } else if (request.headers.get("Accept")?.includes("text/html")) {
    event.respondWith(handleHTMLRequest(request))
  } else {
    event.respondWith(handleGenericRequest(request))
  }
})

// Handle API requests with intelligent caching
async function handleAPIRequest(request) {
  const url = new URL(request.url)

  // Bible API - stale while revalidate
  if (url.pathname.startsWith("/api/bible/")) {
    return staleWhileRevalidate(request, DYNAMIC_CACHE)
  }

  // AI API - cache with shorter TTL
  if (url.pathname.startsWith("/api/ai/")) {
    return cacheFirst(request, AI_CACHE, { maxAge: 1800 }) // 30 minutes
  }

  // User/Auth API - network first
  if (CACHE_STRATEGIES.NETWORK_FIRST.test(url.pathname)) {
    return networkFirst(request)
  }

  // Default to network first for other APIs
  return networkFirst(request)
}

// Handle static assets - cache first with long TTL
async function handleStaticAsset(request) {
  return cacheFirst(request, CACHE_NAME, { maxAge: 86400 }) // 24 hours
}

// Handle HTML requests - network first with offline fallback
async function handleHTMLRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request)

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    // Try cache
    const cachedResponse = await caches.match(request)
    if (cachedResponse) {
      return cachedResponse
    }

    // Return offline page
    return caches.match("/offline.html")
  }
}

// Handle other requests
async function handleGenericRequest(request) {
  return staleWhileRevalidate(request, DYNAMIC_CACHE)
}

// Cache-first strategy
async function cacheFirst(request, cacheName, options = {}) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)

  if (cachedResponse) {
    // Check if cache is still fresh
    const cacheDate = new Date(cachedResponse.headers.get("date") || 0)
    const now = new Date()
    const age = (now.getTime() - cacheDate.getTime()) / 1000

    if (!options.maxAge || age < options.maxAge) {
      return cachedResponse
    }
  }

  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    return cachedResponse || new Response("Offline", { status: 503 })
  }
}

// Network-first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request)

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, networkResponse.clone())
    }

    return networkResponse
  } catch (error) {
    const cachedResponse = await caches.match(request)
    return cachedResponse || new Response("Offline", { status: 503 })
  }
}

// Stale-while-revalidate strategy
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)

  // Start network request (don't await)
  const networkPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone())
      }
      return response
    })
    .catch(() => null)

  // Return cached response immediately if available
  if (cachedResponse) {
    return cachedResponse
  }

  // Wait for network if no cache
  return networkPromise || new Response("Offline", { status: 503 })
}

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-saved-verses") {
    event.waitUntil(syncSavedVerses())
  } else if (event.tag === "sync-reading-progress") {
    event.waitUntil(syncReadingProgress())
  } else if (event.tag === "sync-ai-conversations") {
    event.waitUntil(syncAIConversations())
  }
})

// Enhanced sync functions
async function syncSavedVerses() {
  try {
    const db = await openIndexedDB()
    const pendingSaves = await getFromIndexedDB(db, "pendingVerses")

    for (const item of pendingSaves) {
      try {
        const response = await fetch("/api/user/verses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        })

        if (response.ok) {
          await deleteFromIndexedDB(db, "pendingVerses", item.id)
        }
      } catch (err) {
        console.error("Failed to sync verse:", err)
      }
    }
  } catch (err) {
    console.error("Error in syncSavedVerses:", err)
  }
}

async function syncReadingProgress() {
  try {
    const db = await openIndexedDB()
    const pendingProgress = await getFromIndexedDB(db, "pendingProgress")

    for (const item of pendingProgress) {
      try {
        const response = await fetch("/api/user/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        })

        if (response.ok) {
          await deleteFromIndexedDB(db, "pendingProgress", item.id)
        }
      } catch (err) {
        console.error("Failed to sync progress:", err)
      }
    }
  } catch (err) {
    console.error("Error in syncReadingProgress:", err)
  }
}

async function syncAIConversations() {
  try {
    const db = await openIndexedDB()
    const pendingConversations = await getFromIndexedDB(db, "pendingConversations")

    for (const item of pendingConversations) {
      try {
        const response = await fetch("/api/ai/conversations/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(item),
        })

        if (response.ok) {
          await deleteFromIndexedDB(db, "pendingConversations", item.id)
        }
      } catch (err) {
        console.error("Failed to sync conversation:", err)
      }
    }
  } catch (err) {
    console.error("Error in syncAIConversations:", err)
  }
}

// Enhanced IndexedDB operations
function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("BibleAFOfflineDB", 2)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains("pendingVerses")) {
        db.createObjectStore("pendingVerses", { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains("pendingProgress")) {
        db.createObjectStore("pendingProgress", { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains("pendingConversations")) {
        db.createObjectStore("pendingConversations", { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains("offlineBibleData")) {
        const store = db.createObjectStore("offlineBibleData", { keyPath: "id" })
        store.createIndex("reference", "reference", { unique: false })
        store.createIndex("book", "book", { unique: false })
      }
    }
  })
}

async function getFromIndexedDB(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readonly")
    const store = transaction.objectStore(storeName)
    const request = store.getAll()

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

async function deleteFromIndexedDB(db, storeName, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite")
    const store = transaction.objectStore(storeName)
    const request = store.delete(id)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

// Message handling for cache management
self.addEventListener("message", (event) => {
  if (event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  } else if (event.data.type === "CACHE_BIBLE_DATA") {
    event.waitUntil(cacheBibleData(event.data.data))
  } else if (event.data.type === "CLEAR_CACHE") {
    event.waitUntil(clearSpecificCache(event.data.cacheName))
  }
})

async function cacheBibleData(data) {
  try {
    const cache = await caches.open(DYNAMIC_CACHE)
    const db = await openIndexedDB()

    // Cache in both cache API and IndexedDB for robust offline support
    await Promise.all([
      cache.put(`/api/bible/verse/${data.reference}`, new Response(JSON.stringify(data))),
      storeInIndexedDB(db, "offlineBibleData", data),
    ])
  } catch (error) {
    console.error("Failed to cache Bible data:", error)
  }
}

async function storeInIndexedDB(db, storeName, data) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite")
    const store = transaction.objectStore(storeName)
    const request = store.put(data)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

async function clearSpecificCache(cacheName) {
  try {
    await caches.delete(cacheName)
    console.log(`Cleared cache: ${cacheName}`)
  } catch (error) {
    console.error(`Failed to clear cache ${cacheName}:`, error)
  }
}

// Periodic cache cleanup
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "cache-cleanup") {
    event.waitUntil(performCacheCleanup())
  }
})

async function performCacheCleanup() {
  try {
    const cacheNames = await caches.keys()
    const now = Date.now()
    const maxAge = 7 * 24 * 60 * 60 * 1000 // 7 days

    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName)
      const requests = await cache.keys()

      for (const request of requests) {
        const response = await cache.match(request)
        if (response) {
          const cacheDate = new Date(response.headers.get("date") || 0)
          if (now - cacheDate.getTime() > maxAge) {
            await cache.delete(request)
          }
        }
      }
    }

    console.log("Cache cleanup completed")
  } catch (error) {
    console.error("Cache cleanup failed:", error)
  }
}
