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
    lastSearchReset: string
  }
  preferences: {
    theme: "light" | "dark" | "system"
    notifications: boolean
    verseCategories?: string[] // Added verseCategories property
  }
  createdAt: string
  updatedAt: string
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

// User data operations
export async function saveUserData(userData: UserData): Promise<void> {
  try {
    const blob = await put(`users/${userData.id}/profile.json`, JSON.stringify(userData), {
      access: "public",
      contentType: "application/json",
    })
    console.log("User data saved:", blob.url)
  } catch (error) {
    console.error("Error saving user data:", error)
    throw new Error("Failed to save user data")
  }
}

export async function getUserData(userId: string): Promise<UserData | null> {
  try {
    const response = await fetch(
      `${process.env.BLOB_READ_WRITE_TOKEN ? "https://blob.vercel-storage.com" : ""}/users/${userId}/profile.json`,
    )
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error("Failed to fetch user data")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}

// Saved verses operations
export async function saveVerse(verse: SavedVerse): Promise<void> {
  try {
    const blob = await put(`users/${verse.userId}/verses/${verse.id}.json`, JSON.stringify(verse), {
      access: "public",
      contentType: "application/json",
    })

    // Update the verses index
    await updateVersesIndex(verse.userId, verse.id, "add")
    console.log("Verse saved:", blob.url)
  } catch (error) {
    console.error("Error saving verse:", error)
    throw new Error("Failed to save verse")
  }
}

export async function getUserVerses(userId: string): Promise<SavedVerse[]> {
  try {
    // Get the verses index first
    const indexResponse = await fetch(
      `${process.env.BLOB_READ_WRITE_TOKEN ? "https://blob.vercel-storage.com" : ""}/users/${userId}/verses/index.json`,
    )

    if (!indexResponse.ok) {
      if (indexResponse.status === 404) return []
      throw new Error("Failed to fetch verses index")
    }

    const index: string[] = await indexResponse.json()
    const verses: SavedVerse[] = []

    // Fetch each verse
    for (const verseId of index) {
      try {
        const verseResponse = await fetch(
          `${process.env.BLOB_READ_WRITE_TOKEN ? "https://blob.vercel-storage.com" : ""}/users/${userId}/verses/${verseId}.json`,
        )
        if (verseResponse.ok) {
          const verse = await verseResponse.json()
          verses.push(verse)
        }
      } catch (error) {
        console.error(`Error fetching verse ${verseId}:`, error)
      }
    }

    return verses.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch (error) {
    console.error("Error fetching user verses:", error)
    return []
  }
}

export async function deleteVerse(userId: string, verseId: string): Promise<void> {
  try {
    await del(`users/${userId}/verses/${verseId}.json`)
    await updateVersesIndex(userId, verseId, "remove")
    console.log("Verse deleted:", verseId)
  } catch (error) {
    console.error("Error deleting verse:", error)
    throw new Error("Failed to delete verse")
  }
}

// Reading progress operations
export async function saveReadingProgress(progress: ReadingProgress): Promise<void> {
  try {
    const blob = await put(`users/${progress.userId}/progress.json`, JSON.stringify(progress), {
      access: "public",
      contentType: "application/json",
    })
    console.log("Reading progress saved:", blob.url)
  } catch (error) {
    console.error("Error saving reading progress:", error)
    throw new Error("Failed to save reading progress")
  }
}

export async function getReadingProgress(userId: string): Promise<ReadingProgress | null> {
  try {
    const response = await fetch(
      `${process.env.BLOB_READ_WRITE_TOKEN ? "https://blob.vercel-storage.com" : ""}/users/${userId}/progress.json`,
    )
    if (!response.ok) {
      if (response.status === 404) return null
      throw new Error("Failed to fetch reading progress")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching reading progress:", error)
    return null
  }
}

// Helper function to update verses index
async function updateVersesIndex(userId: string, verseId: string, operation: "add" | "remove"): Promise<void> {
  try {
    let index: string[] = []

    // Try to get existing index
    try {
      const response = await fetch(
        `${process.env.BLOB_READ_WRITE_TOKEN ? "https://blob.vercel-storage.com" : ""}/users/${userId}/verses/index.json`,
      )
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
    })
  } catch (error) {
    console.error("Error updating verses index:", error)
  }
}

// Usage tracking operations
export async function updateUsageTracking(userId: string, type: "search" | "guidance"): Promise<boolean> {
  try {
    const userData = await getUserData(userId)
    if (!userData) return false

    const today = new Date().toISOString().split("T")[0]
    const lastReset = userData.subscription.lastSearchReset.split("T")[0]

    // Reset daily usage if it's a new day
    if (today !== lastReset) {
      userData.subscription.searchesUsedToday = 0
      userData.subscription.lastSearchReset = new Date().toISOString()
    }

    // Check limits based on subscription tier
    const limits = getUsageLimits(userData.subscription.tier)

    if (type === "search" && userData.subscription.searchesUsedToday >= limits.searches) {
      return false // Limit exceeded
    }

    // Increment usage
    if (type === "search") {
      userData.subscription.searchesUsedToday++
    }

    userData.updatedAt = new Date().toISOString()
    await saveUserData(userData)

    return true
  } catch (error) {
    console.error("Error updating usage tracking:", error)
    return false
  }
}

function getUsageLimits(tier: string) {
  switch (tier) {
    case "premium":
    case "annual":
      return { searches: Number.POSITIVE_INFINITY, guidance: Number.POSITIVE_INFINITY }
    case "basic":
      return { searches: 20, guidance: 10 }
    case "free":
    default:
      return { searches: 5, guidance: 3 }
  }
}
