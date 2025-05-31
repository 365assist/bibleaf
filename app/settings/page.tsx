"use client"

import { useState, useEffect } from "react"
import { Trash2, RefreshCw, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { VoiceSettings } from "@/components/voice-settings"
import { clearAudioCache, getAudioCacheStats } from "@/lib/offline-audio-cache"
import { clearTTSMemoryCache, getTTSMemoryCacheSize } from "@/lib/tts-client"

export default function SettingsPage() {
  const [offlineCacheStats, setOfflineCacheStats] = useState({ count: 0, size: 0 })
  const [memoryCacheSize, setMemoryCacheSize] = useState(0)
  const [isClearing, setIsClearing] = useState(false)
  const [offlineMode, setOfflineMode] = useState(false)
  const [autoDownload, setAutoDownload] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    if (typeof window !== "undefined") {
      setOfflineMode(localStorage.getItem("offline_mode") === "true")
      setAutoDownload(localStorage.getItem("auto_download_audio") === "true")
    }

    // Get cache stats
    updateCacheStats()
  }, [])

  const updateCacheStats = async () => {
    const stats = await getAudioCacheStats()
    setOfflineCacheStats(stats)
    setMemoryCacheSize(getTTSMemoryCacheSize())
  }

  const handleClearCache = async () => {
    setIsClearing(true)
    await clearAudioCache()
    clearTTSMemoryCache()
    await updateCacheStats()
    setIsClearing(false)
  }

  const toggleOfflineMode = (value: boolean) => {
    setOfflineMode(value)
    localStorage.setItem("offline_mode", value.toString())
  }

  const toggleAutoDownload = (value: boolean) => {
    setAutoDownload(value)
    localStorage.setItem("auto_download_audio", value.toString())
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="grid gap-6">
        {/* Voice Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Voice Settings</CardTitle>
            <CardDescription>Configure your preferred voice for text-to-speech</CardDescription>
          </CardHeader>
          <CardContent>
            <VoiceSettings className="w-full" />
          </CardContent>
        </Card>

        {/* Offline Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Offline Settings</CardTitle>
            <CardDescription>Configure offline behavior and cache management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="offline-mode">Offline Mode</Label>
                <p className="text-sm text-muted-foreground">Use cached audio when offline</p>
              </div>
              <Switch id="offline-mode" checked={offlineMode} onCheckedChange={toggleOfflineMode} />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-download">Auto Download</Label>
                <p className="text-sm text-muted-foreground">Automatically download audio for offline use</p>
              </div>
              <Switch id="auto-download" checked={autoDownload} onCheckedChange={toggleAutoDownload} />
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-2">Audio Cache</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Offline Cache</span>
                  </div>
                  <p className="text-2xl font-bold">{offlineCacheStats.count} items</p>
                  <p className="text-sm text-muted-foreground">{formatBytes(offlineCacheStats.size)}</p>
                </div>

                <div className="p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 mb-1">
                    <Database className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Memory Cache</span>
                  </div>
                  <p className="text-2xl font-bold">{formatBytes(memoryCacheSize * 1024 * 1024)}</p>
                  <p className="text-sm text-muted-foreground">Current session only</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" size="sm" onClick={updateCacheStats} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh Stats
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearCache}
              disabled={isClearing || (offlineCacheStats.count === 0 && memoryCacheSize === 0)}
              className="gap-2"
            >
              {isClearing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Clear All Caches
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
