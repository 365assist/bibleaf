import type { NextRequest } from "next/server"

export interface CacheConfig {
  ttl: number // Time to live in seconds
  staleWhileRevalidate?: number // Additional time to serve stale content
  tags?: string[] // Cache tags for invalidation
  key?: string // Custom cache key
}

export interface CachedResponse<T = any> {
  data: T
  timestamp: number
  ttl: number
  tags: string[]
}

export class EnhancedCacheService {
  private static cache = new Map<string, CachedResponse>()
  private static readonly DEFAULT_TTL = 300 // 5 minutes
  private static readonly MAX_CACHE_SIZE = 1000

  /**
   * Get cached data if valid, undefined if expired or not found
   */
  static get<T>(key: string): T | undefined {
    const cached = this.cache.get(key)
    if (!cached) return undefined

    const now = Date.now()
    const age = (now - cached.timestamp) / 1000

    // Check if cache is still valid
    if (age <= cached.ttl) {
      return cached.data as T
    }

    // Remove expired cache
    this.cache.delete(key)
    return undefined
  }

  /**
   * Set data in cache with optional configuration
   */
  static set<T>(key: string, data: T, config: Partial<CacheConfig> = {}): void {
    // Prevent cache from growing too large
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictOldest()
    }

    const cachedResponse: CachedResponse<T> = {
      data,
      timestamp: Date.now(),
      ttl: config.ttl || this.DEFAULT_TTL,
      tags: config.tags || [],
    }

    this.cache.set(key, cachedResponse)
  }

  /**
   * Get stale data that can be served while revalidating
   */
  static getStale<T>(key: string, staleTime = 300): T | undefined {
    const cached = this.cache.get(key)
    if (!cached) return undefined

    const now = Date.now()
    const age = (now - cached.timestamp) / 1000

    // Serve stale content if within stale time window
    if (age <= cached.ttl + staleTime) {
      return cached.data as T
    }

    return undefined
  }

  /**
   * Invalidate cache by tags
   */
  static invalidateByTags(tags: string[]): void {
    for (const [key, cached] of this.cache.entries()) {
      if (cached.tags.some((tag) => tags.includes(tag))) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Clear specific cache entry
   */
  static invalidate(key: string): void {
    this.cache.delete(key)
  }

  /**
   * Clear all cache
   */
  static clear(): void {
    this.cache.clear()
  }

  /**
   * Generate cache key from request
   */
  static generateKey(request: NextRequest, additionalParams: Record<string, any> = {}): string {
    const url = new URL(request.url)
    const searchParams = Object.fromEntries(url.searchParams.entries())

    const keyData = {
      pathname: url.pathname,
      search: searchParams,
      ...additionalParams,
    }

    return `cache:${JSON.stringify(keyData)}`
  }

  /**
   * Bible-specific cache keys and configurations
   */
  static readonly BIBLE_CACHE = {
    // Verse cache - long TTL since Bible text doesn't change
    verse: (reference: string) => ({
      key: `bible:verse:${reference}`,
      ttl: 86400, // 24 hours
      tags: ["bible", "verse"],
    }),

    // Chapter cache
    chapter: (book: string, chapter: number) => ({
      key: `bible:chapter:${book}:${chapter}`,
      ttl: 86400, // 24 hours
      tags: ["bible", "chapter"],
    }),

    // Search results - shorter TTL
    search: (query: string, page = 1) => ({
      key: `bible:search:${query}:${page}`,
      ttl: 1800, // 30 minutes
      tags: ["bible", "search"],
    }),

    // AI insights - medium TTL
    aiInsights: (reference: string, type: string) => ({
      key: `ai:insights:${type}:${reference}`,
      ttl: 3600, // 1 hour
      tags: ["ai", "insights"],
    }),

    // Daily verse - daily TTL
    dailyVerse: (date: string) => ({
      key: `daily:verse:${date}`,
      ttl: 86400, // 24 hours
      tags: ["daily", "verse"],
    }),

    // Cross references
    crossReferences: (reference: string) => ({
      key: `bible:cross-refs:${reference}`,
      ttl: 86400, // 24 hours
      tags: ["bible", "cross-references"],
    }),

    // Commentary
    commentary: (reference: string) => ({
      key: `bible:commentary:${reference}`,
      ttl: 86400, // 24 hours
      tags: ["bible", "commentary"],
    }),
  }

  /**
   * AI service cache configurations
   */
  static readonly AI_CACHE = {
    guidance: (query: string, userId?: string) => ({
      key: `ai:guidance:${query}${userId ? `:${userId}` : ""}`,
      ttl: 1800, // 30 minutes
      tags: ["ai", "guidance"],
    }),

    heartToHeart: (conversationId: string) => ({
      key: `ai:heart-to-heart:${conversationId}`,
      ttl: 3600, // 1 hour
      tags: ["ai", "conversation"],
    }),

    devotional: (date: string) => ({
      key: `ai:devotional:${date}`,
      ttl: 86400, // 24 hours
      tags: ["ai", "devotional"],
    }),
  }

  /**
   * User-specific cache configurations
   */
  static readonly USER_CACHE = {
    savedVerses: (userId: string) => ({
      key: `user:saved-verses:${userId}`,
      ttl: 300, // 5 minutes
      tags: ["user", "saved-verses"],
    }),

    readingProgress: (userId: string) => ({
      key: `user:reading-progress:${userId}`,
      ttl: 300, // 5 minutes
      tags: ["user", "progress"],
    }),

    preferences: (userId: string) => ({
      key: `user:preferences:${userId}`,
      ttl: 1800, // 30 minutes
      tags: ["user", "preferences"],
    }),
  }

  /**
   * Cache wrapper for async functions with automatic cache management
   */
  static async cached<T>(
    cacheConfig: { key: string; ttl: number; tags: string[] },
    fetchFn: () => Promise<T>,
    staleWhileRevalidate = false,
  ): Promise<T> {
    // Try to get from cache first
    const cached = this.get<T>(cacheConfig.key)
    if (cached) {
      return cached
    }

    // Check for stale content if SWR is enabled
    if (staleWhileRevalidate) {
      const stale = this.getStale<T>(cacheConfig.key, 600) // 10 minutes stale time
      if (stale) {
        // Return stale content immediately and revalidate in background
        this.revalidateInBackground(cacheConfig, fetchFn)
        return stale
      }
    }

    // Fetch fresh data
    try {
      const data = await fetchFn()
      this.set(cacheConfig.key, data, cacheConfig)
      return data
    } catch (error) {
      // If we have stale data, return it on error
      const stale = this.getStale<T>(cacheConfig.key, 3600) // 1 hour stale on error
      if (stale) {
        return stale
      }
      throw error
    }
  }

  /**
   * Revalidate cache in background
   */
  private static async revalidateInBackground<T>(
    cacheConfig: { key: string; ttl: number; tags: string[] },
    fetchFn: () => Promise<T>,
  ): Promise<void> {
    try {
      const data = await fetchFn()
      this.set(cacheConfig.key, data, cacheConfig)
    } catch (error) {
      console.warn(`Background revalidation failed for ${cacheConfig.key}:`, error)
    }
  }

  /**
   * Remove oldest cache entries
   */
  private static evictOldest(): void {
    let oldestKey = ""
    let oldestTime = Date.now()

    for (const [key, cached] of this.cache.entries()) {
      if (cached.timestamp < oldestTime) {
        oldestTime = cached.timestamp
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }

  /**
   * Get cache statistics
   */
  static getStats() {
    const now = Date.now()
    let validEntries = 0
    let expiredEntries = 0
    let totalSize = 0

    for (const [key, cached] of this.cache.entries()) {
      totalSize++
      const age = (now - cached.timestamp) / 1000
      if (age <= cached.ttl) {
        validEntries++
      } else {
        expiredEntries++
      }
    }

    return {
      totalEntries: totalSize,
      validEntries,
      expiredEntries,
      hitRate: validEntries / Math.max(totalSize, 1),
      maxSize: this.MAX_CACHE_SIZE,
    }
  }

  /**
   * Cleanup expired entries
   */
  static cleanup(): void {
    const now = Date.now()
    for (const [key, cached] of this.cache.entries()) {
      const age = (now - cached.timestamp) / 1000
      if (age > cached.ttl) {
        this.cache.delete(key)
      }
    }
  }
}

// Setup automatic cleanup every 5 minutes
if (typeof window === "undefined") {
  // Server-side only
  setInterval(() => {
    EnhancedCacheService.cleanup()
  }, 300000) // 5 minutes
}
