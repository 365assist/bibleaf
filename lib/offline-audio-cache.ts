/**
 * Utility for caching TTS audio in IndexedDB for offline use
 */

const DB_NAME = "bibleaf_audio_cache"
const STORE_NAME = "audio_files"
const DB_VERSION = 1

interface AudioCacheItem {
  id: string
  blob: Blob
  timestamp: number
  metadata?: {
    text: string
    voiceId: string
    reference?: string
  }
}

let db: IDBDatabase | null = null

// Initialize the database
export async function initAudioCache(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      resolve(false)
      return
    }

    if (!window.indexedDB) {
      console.warn("IndexedDB not supported - offline audio caching unavailable")
      resolve(false)
      return
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = (event) => {
      console.error("Failed to open IndexedDB:", event)
      resolve(false)
    }

    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result
      resolve(true)
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result

      // Create object store for audio files
      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: "id" })
        store.createIndex("timestamp", "timestamp", { unique: false })
      }
    }
  })
}

// Generate a cache key from parameters
export function generateAudioCacheKey(text: string, voiceId: string): string {
  return `${voiceId}:${text.substring(0, 100)}`
}

// Save audio to cache
export async function saveAudioToCache(
  id: string,
  blob: Blob,
  metadata?: { text: string; voiceId: string; reference?: string },
): Promise<boolean> {
  if (!db) {
    await initAudioCache()
    if (!db) return false
  }

  return new Promise((resolve) => {
    try {
      const transaction = db!.transaction([STORE_NAME], "readwrite")
      const store = transaction.objectStore(STORE_NAME)

      const item: AudioCacheItem = {
        id,
        blob,
        timestamp: Date.now(),
        metadata,
      }

      const request = store.put(item)

      request.onsuccess = () => resolve(true)
      request.onerror = () => resolve(false)
    } catch (error) {
      console.error("Error saving audio to cache:", error)
      resolve(false)
    }
  })
}

// Get audio from cache
export async function getAudioFromCache(id: string): Promise<Blob | null> {
  if (!db) {
    await initAudioCache()
    if (!db) return null
  }

  return new Promise((resolve) => {
    try {
      const transaction = db!.transaction([STORE_NAME], "readonly")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(id)

      request.onsuccess = () => {
        const result = request.result as AudioCacheItem | undefined
        resolve(result?.blob || null)
      }

      request.onerror = () => resolve(null)
    } catch (error) {
      console.error("Error getting audio from cache:", error)
      resolve(null)
    }
  })
}

// Delete audio from cache
export async function deleteAudioFromCache(id: string): Promise<boolean> {
  if (!db) {
    await initAudioCache()
    if (!db) return false
  }

  return new Promise((resolve) => {
    try {
      const transaction = db!.transaction([STORE_NAME], "readwrite")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(id)

      request.onsuccess = () => resolve(true)
      request.onerror = () => resolve(false)
    } catch (error) {
      console.error("Error deleting audio from cache:", error)
      resolve(false)
    }
  })
}

// Clear all audio from cache
export async function clearAudioCache(): Promise<boolean> {
  if (!db) {
    await initAudioCache()
    if (!db) return false
  }

  return new Promise((resolve) => {
    try {
      const transaction = db!.transaction([STORE_NAME], "readwrite")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.clear()

      request.onsuccess = () => resolve(true)
      request.onerror = () => resolve(false)
    } catch (error) {
      console.error("Error clearing audio cache:", error)
      resolve(false)
    }
  })
}

// Get cache stats
export async function getAudioCacheStats(): Promise<{ count: number; size: number }> {
  if (!db) {
    await initAudioCache()
    if (!db) return { count: 0, size: 0 }
  }

  return new Promise((resolve) => {
    try {
      const transaction = db!.transaction([STORE_NAME], "readonly")
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()

      request.onsuccess = () => {
        const items = request.result as AudioCacheItem[]
        const count = items.length
        const size = items.reduce((total, item) => total + item.blob.size, 0)
        resolve({ count, size })
      }

      request.onerror = () => resolve({ count: 0, size: 0 })
    } catch (error) {
      console.error("Error getting audio cache stats:", error)
      resolve({ count: 0, size: 0 })
    }
  })
}

// Initialize cache on load if in browser
if (typeof window !== "undefined") {
  initAudioCache().catch(console.error)
}
