import { put, del } from "@vercel/blob"

// Types for stored data
export interface UserData {
  id: string
  email: string
  name: string
  subscription: {
    tier: "free" | "basic" | "premium" | "annual"
    status: "active" | "canceled" | "expired"
    searchesUsedToday: number
    guidanceUsedToday: number
    lastSearchReset: string
  }
  preferences: {
    theme: "light" | "dark" | "system"
    notifications: boolean
    verseCategories: string[]
  }
  createdAt: string
  updatedAt?: string
}

export interface SavedVerse {
  id: string
  userId: string
  reference: string
  text: string
  translation: string
  notes: string
  tags: string[]
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface ReadingProgress {
  userId: string
  currentBook: string
  currentChapter: number
  currentVerse: number
  lastReadAt: string
  completedChapters: Record<string, number[]>
}

// Check if blob storage is configured
const isBlobConfigured = () => {
  return typeof process !== "undefined" && process.env && !!process.env.BLOB_READ_WRITE_TOKEN
}

// In-memory cache for user data to reduce blob storage calls
const userDataCache = new Map<string, { data: UserData; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

// Helper function to handle blob storage errors
const handleBlobError = (error: any, operation: string) => {
  const errorMessage = error.message || error.toString()

  if (errorMessage.includes("Too Many Requests") || errorMessage.includes("rate limit")) {
    console.warn(`Blob storage rate limited for ${operation}, using fallback`)
    return "RATE_LIMITED"
  }

  if (errorMessage.includes("quota") || errorMessage.includes("limit exceeded")) {
    console.warn(`Blob storage quota exceeded for ${operation}, using fallback`)
    return "QUOTA_EXCEEDED"
  }

  console.error(`Blob storage error for ${operation}:`, errorMessage)
  return "ERROR"
}

// Initialize user data function
export async function initializeUserData(userId: string, userData: Partial<UserData>): Promise<void> {
  const fullUserData: UserData = {
    id: userId,
    email: userData.email || `${userId}@example.com`,
    name: userData.name || userId.split("@")[0] || "User",
    subscription: {
      tier: "free",
      status: "active",
      searchesUsedToday: 0,
      guidanceUsedToday: 0,
      lastSearchReset: new Date().toISOString(),
      ...userData.subscription,
    },
    preferences: {
      theme: "system",
      notifications: true,
      verseCategories: [],
      ...userData.preferences,
    },
    createdAt: userData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  await saveUserData(fullUserData)
}

// User data operations
export async function saveUserData(userData: UserData): Promise<void> {
  try {
    // Check if blob storage is configured
    if (!isBlobConfigured()) {
      console.log("Blob storage not configured - caching user data locally")
      userDataCache.set(userData.id, { data: userData, timestamp: Date.now() })
      return
    }

    const blob = await put(`users/${userData.id}/profile.json`, JSON.stringify(userData), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
    })

    // Update cache on successful save
    userDataCache.set(userData.id, { data: userData, timestamp: Date.now() })
    console.log("User data saved:", blob.url)
  } catch (error) {
    const errorType = handleBlobError(error, "saveUserData")

    if (errorType === "RATE_LIMITED" || errorType === "QUOTA_EXCEEDED") {
      // Cache the data locally as fallback
      userDataCache.set(userData.id, { data: userData, timestamp: Date.now() })
      console.log("User data cached locally due to storage limitations")
      return
    }

    throw new Error("Failed to save user data")
  }
}

export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    // Check cache first
    const cached = userDataCache.get(userId)
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log("Returning cached user data")
      return cached.data
    }

    // Check if blob storage is configured
    if (!isBlobConfigured()) {
      console.log("Blob storage not configured - checking cache only")
      return cached?.data || null
    }

    const response = await fetch(`https://blob.vercel-storage.com/users/${userId}/profile.json`, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        console.log("User data not found in blob storage")
        return cached?.data || null
      }

      // Check if it's a rate limit or quota error
      const responseText = await response.text()
      if (responseText.includes("Too Many Requests") || responseText.includes("rate limit")) {
        console.warn("Blob storage rate limited, using cached data")
        return cached?.data || null
      }

      throw new Error(`HTTP ${response.status}: ${responseText}`)
    }

    const contentType = response.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      const responseText = await response.text()
      console.error("Non-JSON response:", responseText)
      return cached?.data || null
    }

    const userData = await response.json()

    // Update cache
    userDataCache.set(userId, { data: userData, timestamp: Date.now() })

    return userData
  } catch (error) {
    const errorType = handleBlobError(error, "getUserData")

    if (errorType === "RATE_LIMITED" || errorType === "QUOTA_EXCEEDED") {
      // Return cached data if available
      const cached = userDataCache.get(userId)
      if (cached) {
        console.log("Using cached data due to storage limitations")
        return cached.data
      }
    }

    console.error("Error fetching user data:", error)
    return null
  }
}

// Saved verses operations
export async function saveVerse(verse: SavedVerse): Promise<void> {
  try {
    // Check if blob storage is configured
    if (!isBlobConfigured()) {
      console.log("Blob storage not configured - skipping verse save")
      return
    }

    const blob = await put(`users/${verse.userId}/verses/${verse.id}.json`, JSON.stringify(verse), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
    })

    // Update the verses index
    await updateVersesIndex(verse.userId, verse.id, "add")
    console.log("Verse saved:", blob.url)
  } catch (error) {
    const errorType = handleBlobError(error, "saveVerse")

    if (errorType === "RATE_LIMITED" || errorType === "QUOTA_EXCEEDED") {
      console.log("Verse save skipped due to storage limitations")
      return
    }

    throw new Error("Failed to save verse")
  }
}

export async function getUserVerses(userId: string): Promise<SavedVerse[]> {
  try {
    // Check if blob storage is configured
    if (!isBlobConfigured()) {
      console.log("Blob storage not configured - skipping verses fetch")
      return []
    }

    // Get the verses index first
    const indexResponse = await fetch(`https://blob.vercel-storage.com/users/${userId}/verses/index.json`, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    })

    // If the index file doesn't exist, return an empty array
    if (!indexResponse.ok) {
      if (indexResponse.status === 404) return []

      const responseText = await indexResponse.text()
      if (responseText.includes("Too Many Requests") || responseText.includes("rate limit")) {
        console.warn("Verses fetch rate limited")
        return []
      }

      throw new Error("Failed to fetch verses index")
    }

    // Try to parse the index JSON, with error handling
    let index: string[] = []
    try {
      const text = await indexResponse.text()
      if (text && text.trim()) {
        index = JSON.parse(text)
      }
    } catch (parseError) {
      console.error("Error parsing verses index:", parseError)
      return []
    }

    // If index is not an array, return empty array
    if (!Array.isArray(index)) {
      console.error("Verses index is not an array")
      return []
    }

    const verses: SavedVerse[] = []

    // Fetch each verse with error handling
    for (const verseId of index) {
      try {
        const verseResponse = await fetch(`https://blob.vercel-storage.com/users/${userId}/verses/${verseId}.json`, {
          headers: {
            Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
          },
        })
        if (verseResponse.ok) {
          const text = await verseResponse.text()
          if (text && text.trim()) {
            const verse = JSON.parse(text)
            verses.push(verse)
          }
        }
      } catch (error) {
        console.error(`Error fetching verse ${verseId}:`, error)
      }
    }

    return verses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    const errorType = handleBlobError(error, "getUserVerses")

    if (errorType === "RATE_LIMITED" || errorType === "QUOTA_EXCEEDED") {
      console.log("Verses fetch skipped due to storage limitations")
      return []
    }

    console.error("Error fetching user verses:", error)
    return []
  }
}

export async function deleteVerse(userId: string, verseId: string): Promise<void> {
  try {
    // Check if blob storage is configured
    if (!isBlobConfigured()) {
      console.log("Blob storage not configured - skipping verse delete")
      return
    }

    await del(`users/${userId}/verses/${verseId}.json`)
    await updateVersesIndex(userId, verseId, "remove")
    console.log("Verse deleted:", verseId)
  } catch (error) {
    const errorType = handleBlobError(error, "deleteVerse")

    if (errorType === "RATE_LIMITED" || errorType === "QUOTA_EXCEEDED") {
      console.log("Verse delete skipped due to storage limitations")
      return
    }

    throw new Error("Failed to delete verse")
  }
}

// Reading progress operations
export async function saveReadingProgress(progress: ReadingProgress): Promise<void> {
  try {
    // Check if blob storage is configured
    if (!isBlobConfigured()) {
      console.log("Blob storage not configured - skipping reading progress save")
      return
    }

    const blob = await put(`users/${progress.userId}/progress.json`, JSON.stringify(progress), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
    })
    console.log("Reading progress saved:", blob.url)
  } catch (error) {
    const errorType = handleBlobError(error, "saveReadingProgress")

    if (errorType === "RATE_LIMITED" || errorType === "QUOTA_EXCEEDED") {
      console.log("Reading progress save skipped due to storage limitations")
      return
    }

    throw new Error("Failed to save reading progress")
  }
}

export async function getReadingProgress(userId: string): Promise<ReadingProgress | null> {
  try {
    // Check if blob storage is configured
    if (!isBlobConfigured()) {
      console.log("Blob storage not configured - skipping reading progress fetch")
      return null
    }

    const response = await fetch(`https://blob.vercel-storage.com/users/${userId}/progress.json`, {
      headers: {
        Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) return null

      const responseText = await response.text()
      if (responseText.includes("Too Many Requests") || responseText.includes("rate limit")) {
        console.warn("Reading progress fetch rate limited")
        return null
      }

      throw new Error("Failed to fetch reading progress")
    }

    return await response.json()
  } catch (error) {
    const errorType = handleBlobError(error, "getReadingProgress")

    if (errorType === "RATE_LIMITED" || errorType === "QUOTA_EXCEEDED") {
      console.log("Reading progress fetch skipped due to storage limitations")
      return null
    }

    console.error("Error fetching reading progress:", error)
    return null
  }
}

// Helper function to update verses index
async function updateVersesIndex(userId: string, verseId: string, operation: "add" | "remove"): Promise<void> {
  try {
    // Check if blob storage is configured
    if (!isBlobConfigured()) {
      console.log("Blob storage not configured - skipping verses index update")
      return
    }

    let index: string[] = []

    // Try to get existing index
    try {
      const response = await fetch(`https://blob.vercel-storage.com/users/${userId}/verses/index.json`, {
        headers: {
          Authorization: `Bearer ${process.env.BLOB_READ_WRITE_TOKEN}`,
        },
      })
      if (response.ok) {
        index = await response.json()
      }
    } catch (error) {
      // Index doesn't exist yet, start with empty array
    }

    // Update index
    if (operation === "add" && !index.includes(verseId)) {
      index.push(verseId)
    } else if (operation === "remove") {
      index = index.filter((id) => id !== verseId)
    }

    // Save updated index
    await put(`users/${userId}/verses/index.json`, JSON.stringify(index), {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
    })
  } catch (error) {
    const errorType = handleBlobError(error, "updateVersesIndex")

    if (errorType === "RATE_LIMITED" || errorType === "QUOTA_EXCEEDED") {
      console.log("Verses index update skipped due to storage limitations")
      return
    }

    console.error("Error updating verses index:", error)
  }
}

// Usage tracking operations
export async function updateUsageTracking(userId: string, type: "search" | "guidance"): Promise<boolean> {
  try {
    // Make a POST request to the usage tracking API
    const response = await fetch("/api/usage/track", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        type,
      }),
    })

    const data = await response.json()

    // If limit exceeded, return false
    if (data.limitExceeded) {
      console.log(`Usage limit exceeded for ${userId} - type: ${type}`)
      return false
    }

    return true
  } catch (error) {
    console.error("Error updating usage tracking:", error)
    // In case of error, allow usage for demo purposes
    return true
  }
}

function getUsageLimits(tier: string) {
  switch (tier) {
    case "premium":
    case "annual":
      return { searches: Number.POSITIVE_INFINITY, guidance: Number.POSITIVE_INFINITY }
    case "basic":
      return { searches: 50, guidance: 25 }
    case "free":
    default:
      return { searches: 5, guidance: 5 }
  }
}
