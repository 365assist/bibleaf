"use client"

import useSWR, { type SWRConfiguration } from "swr"
import { useState } from "react"

// Default fetcher function
const defaultFetcher = async (url: string) => {
  const res = await fetch(url)

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.")
    // Attach extra info to the error object.
    const info = await res.json().catch(() => null)
    ;(error as any).info = info
    ;(error as any).status = res.status
    throw error
  }

  return res.json()
}

// Bible verse fetcher with caching
export function useVerse(reference: string | null, options?: SWRConfiguration) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    reference ? `/api/bible/verse?reference=${encodeURIComponent(reference)}` : null,
    defaultFetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      ...options,
    },
  )

  return {
    verse: data,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  }
}

// Bible chapter fetcher with caching
export function useChapter(book: string | null, chapter: number | null, options?: SWRConfiguration) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    book && chapter ? `/api/bible/chapter?book=${encodeURIComponent(book)}&chapter=${chapter}` : null,
    defaultFetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      ...options,
    },
  )

  return {
    chapter: data,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  }
}

// Bible search with caching
export function useBibleSearch(query: string | null, options?: SWRConfiguration) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    query ? `/api/bible/search?q=${encodeURIComponent(query)}` : null,
    defaultFetcher,
    {
      revalidateOnFocus: false,
      ...options,
    },
  )

  return {
    results: data,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  }
}

// Daily verse with caching
export function useDailyVerse(date?: string, options?: SWRConfiguration) {
  const dateParam = date || new Date().toISOString().split("T")[0]
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    `/api/bible/daily-verse?date=${dateParam}`,
    defaultFetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      ...options,
    },
  )

  return {
    dailyVerse: data,
    isLoading,
    isError: error,
    isValidating,
    mutate,
  }
}

// User saved verses with caching and offline support
export function useSavedVerses(userId: string | null, options?: SWRConfiguration) {
  const [offlineVerses, setOfflineVerses] = useState<any[]>([])

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    userId ? `/api/user/verses?userId=${userId}` : null,
    defaultFetcher,
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Only retry up to 3 times
        if (retryCount >= 3) return

        // Retry after 5 seconds
        setTimeout(() => revalidate({ retryCount }), 5000)
      },
      ...options,
    },
  )

  // Load offline verses from IndexedDB when online fetch fails
  if (error && typeof window !== "undefined") {
    // Try to get verses from IndexedDB
    const loadOfflineVerses = async () => {
      try {
        const db = await openIndexedDB()
        const verses = await db.getAll("savedVerses")
        setOfflineVerses(verses)
      } catch (err) {
        console.error("Failed to load offline verses:", err)
      }
    }

    loadOfflineVerses()
  }

  // Function to save verse offline
  const saveVerseOffline = async (verse: any) => {
    if (typeof window === "undefined") return false

    try {
      const db = await openIndexedDB()
      await db.add("savedVerses", {
        ...verse,
        id: verse.id || `offline-${Date.now()}`,
        savedAt: new Date().toISOString(),
      })

      // Also add to pending uploads
      await db.add("pendingVerses", {
        ...verse,
        id: verse.id || `offline-${Date.now()}`,
        userId,
        savedAt: new Date().toISOString(),
      })

      // Register for background sync if supported
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        const registration = await navigator.serviceWorker.ready
        await registration.sync.register("sync-saved-verses")
      }

      // Update local state
      setOfflineVerses((prev) => [...prev, verse])
      return true
    } catch (err) {
      console.error("Failed to save verse offline:", err)
      return false
    }
  }

  return {
    verses: data || offlineVerses,
    isLoading,
    isError: error,
    isValidating,
    isOffline: !!error,
    mutate,
    saveVerseOffline,
  }
}

// Helper function to open IndexedDB
function openIndexedDB() {
  return new Promise<any>((resolve, reject) => {
    const request = indexedDB.open("BibleAFOfflineDB", 1)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => {
      const db = request.result

      // Wrap with simplified API
      resolve({
        getAll: (storeName: string) => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, "readonly")
            const store = transaction.objectStore(storeName)
            const request = store.getAll()

            request.onerror = () => reject(request.error)
            request.onsuccess = () => resolve(request.result)
          })
        },
        get: (storeName: string, key: any) => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, "readonly")
            const store = transaction.objectStore(storeName)
            const request = store.get(key)

            request.onerror = () => reject(request.error)
            request.onsuccess = () => resolve(request.result)
          })
        },
        add: (storeName: string, item: any) => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, "readwrite")
            const store = transaction.objectStore(storeName)
            const request = store.add(item)

            request.onerror = () => reject(request.error)
            request.onsuccess = () => resolve(request.result)
          })
        },
        put: (storeName: string, item: any) => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, "readwrite")
            const store = transaction.objectStore(storeName)
            const request = store.put(item)

            request.onerror = () => reject(request.error)
            request.onsuccess = () => resolve(request.result)
          })
        },
        delete: (storeName: string, key: any) => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, "readwrite")
            const store = transaction.objectStore(storeName)
            const request = store.delete(key)

            request.onerror = () => reject(request.error)
            request.onsuccess = () => resolve(request.result)
          })
        },
      })
    }

    request.onupgradeneeded = (event) => {
      const db = event.target.result

      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains("savedVerses")) {
        db.createObjectStore("savedVerses", { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains("pendingVerses")) {
        db.createObjectStore("pendingVerses", { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains("pendingProgress")) {
        db.createObjectStore("pendingProgress", { keyPath: "id" })
      }
      if (!db.objectStoreNames.contains("bibleCache")) {
        db.createObjectStore("bibleCache", { keyPath: "key" })
      }
    }
  })
}
