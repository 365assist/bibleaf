// src/lib/offline-cache.ts
import { useState, useEffect } from 'react';

// Types for cached data
export interface CachedData<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

// Function to save data to cache
export function saveToCache<T>(key: string, data: T, expiryMinutes: number = 60): void {
  try {
    const now = Date.now();
    const item: CachedData<T> = {
      data,
      timestamp: now,
      expiry: now + expiryMinutes * 60 * 1000,
    };
    
    localStorage.setItem(`bibleaf_${key}`, JSON.stringify(item));
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
}

// Function to get data from cache
export function getFromCache<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(`bibleaf_${key}`);
    
    if (!item) return null;
    
    const cachedItem: CachedData<T> = JSON.parse(item);
    const now = Date.now();
    
    // Check if the cached data has expired
    if (now > cachedItem.expiry) {
      localStorage.removeItem(`bibleaf_${key}`);
      return null;
    }
    
    return cachedItem.data;
  } catch (error) {
    console.error('Error retrieving from cache:', error);
    return null;
  }
}

// Function to clear cache
export function clearCache(key?: string): void {
  try {
    if (key) {
      localStorage.removeItem(`bibleaf_${key}`);
    } else {
      // Clear all BibleAF cache items
      Object.keys(localStorage).forEach(storageKey => {
        if (storageKey.startsWith('bibleaf_')) {
          localStorage.removeItem(storageKey);
        }
      });
    }
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

// Hook for using cached data with automatic fetching
export function useCachedData<T>(
  key: string,
  fetchFn: () => Promise<T>,
  expiryMinutes: number = 60,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Try to get data from cache first
        const cachedData = getFromCache<T>(key);
        
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          return;
        }
        
        // If no cached data, fetch fresh data
        const freshData = await fetchFn();
        setData(freshData);
        
        // Save the fresh data to cache
        saveToCache(key, freshData, expiryMinutes);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: () => clearCache(key) };
}

// Function to check if the app is online
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}
