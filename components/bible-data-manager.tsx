"use client"

import { useState } from "react"
import { Upload, Download, Database, CheckCircle, Loader2 } from "lucide-react"

export default function BibleDataManager() {
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string>("")
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const uploadSampleData = async () => {
    try {
      setUploading(true)
      setUploadStatus("Uploading sample Bible data...")

      const response = await fetch("/api/bible/upload-sample", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (data.success) {
        setUploadStatus("✅ Sample Bible data uploaded successfully!")
        await getBibleStats()
      } else {
        setUploadStatus(`❌ Upload failed: ${data.error}`)
      }
    } catch (error) {
      setUploadStatus(`❌ Upload error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setUploading(false)
    }
  }

  const getBibleStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/bible/stats")
      const data = await response.json()

      if (data.success) {
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Bible Data Manager</h2>
        <p className="text-muted-foreground">Upload sample Bible data to enable full Bible reading functionality</p>
      </div>

      {/* Upload Section */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Sample Data Upload</h3>
        </div>

        <p className="text-sm text-muted-foreground">
          Upload sample Bible chapters including popular books like John, Psalms, Genesis, Matthew, and Proverbs. This
          will enable Bible reading for the most commonly accessed chapters.
        </p>

        <button
          onClick={uploadSampleData}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Upload Sample Data
            </>
          )}
        </button>

        {uploadStatus && (
          <div
            className={`p-3 rounded-lg text-sm ${
              uploadStatus.includes("✅")
                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                : uploadStatus.includes("❌")
                  ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
            }`}
          >
            {uploadStatus}
          </div>
        )}
      </div>

      {/* Stats Section */}
      <div className="border rounded-lg p-6 space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Current Data Status</h3>
        </div>

        <button
          onClick={getBibleStats}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1 border rounded hover:bg-muted"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Refresh Stats
        </button>

        {stats && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-muted/50 rounded">
              <p className="font-medium">Translations</p>
              <p className="text-2xl font-bold text-primary">{stats.totalTranslations}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded">
              <p className="font-medium">Books Available</p>
              <p className="text-2xl font-bold text-primary">{stats.availableBooks?.length || 0}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded">
              <p className="font-medium">Total Verses</p>
              <p className="text-2xl font-bold text-primary">{stats.totalVerses?.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded">
              <p className="font-medium">Last Updated</p>
              <p className="text-xs text-muted-foreground">
                {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleDateString() : "Unknown"}
              </p>
            </div>
          </div>
        )}

        {stats?.availableBooks && (
          <div>
            <p className="font-medium text-sm mb-2">Available Books:</p>
            <div className="flex flex-wrap gap-1 text-xs">
              {stats.availableBooks.slice(0, 10).map((book: string) => (
                <span key={book} className="px-2 py-1 bg-primary/10 text-primary rounded">
                  {book}
                </span>
              ))}
              {stats.availableBooks.length > 10 && (
                <span className="px-2 py-1 bg-muted text-muted-foreground rounded">
                  +{stats.availableBooks.length - 10} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="border rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold">Quick Access</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <a href="/bible/john/3" className="p-2 border rounded hover:bg-muted text-center">
            John 3 (John 3:16)
          </a>
          <a href="/bible/psalms/23" className="p-2 border rounded hover:bg-muted text-center">
            Psalm 23
          </a>
          <a href="/bible/genesis/1" className="p-2 border rounded hover:bg-muted text-center">
            Genesis 1
          </a>
          <a href="/bible/proverbs/3" className="p-2 border rounded hover:bg-muted text-center">
            Proverbs 3
          </a>
        </div>
      </div>
    </div>
  )
}
