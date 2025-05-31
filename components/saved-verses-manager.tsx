"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Tag, Heart, Trash2, Plus } from "lucide-react"
import type { SavedVerse } from "@/lib/blob-storage"

interface SavedVersesManagerProps {
  userId: string
}

export default function SavedVersesManager({ userId }: SavedVersesManagerProps) {
  const [verses, setVerses] = useState<SavedVerse[]>([])
  const [filteredVerses, setFilteredVerses] = useState<SavedVerse[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch verses on component mount
  useEffect(() => {
    fetchVerses()
  }, [userId])

  // Filter verses based on search and tag
  useEffect(() => {
    let filtered = verses

    if (searchQuery) {
      filtered = filtered.filter(
        (verse) =>
          verse.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
          verse.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          verse.notes.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedTag) {
      filtered = filtered.filter((verse) => verse.tags.includes(selectedTag))
    }

    setFilteredVerses(filtered)
  }, [verses, searchQuery, selectedTag])

  const fetchVerses = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/user/verses?userId=${encodeURIComponent(userId)}`)

      // Check if response is ok
      if (!response.ok) {
        console.error(`Error fetching verses: HTTP ${response.status}`)
        setVerses([])
        setError(`Failed to fetch verses (${response.status})`)
        return
      }

      // Check content type
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON:", contentType)
        setVerses([])
        setError("Invalid response format")
        return
      }

      const text = await response.text()

      // Check if we have actual content before parsing
      if (!text || !text.trim()) {
        console.log("No verses data returned")
        setVerses([])
        return
      }

      try {
        const data = JSON.parse(text)
        if (data.verses && Array.isArray(data.verses)) {
          setVerses(data.verses)
        } else {
          console.log("No verses array in response:", data)
          setVerses([])
        }
      } catch (parseError) {
        console.error("Error parsing verses data:", parseError)
        console.error("Response text:", text.substring(0, 200))
        setVerses([])
        setError("Failed to parse verses data")
      }
    } catch (error) {
      console.error("Error fetching verses:", error)
      setVerses([])
      setError("Network error while fetching verses")
    } finally {
      setIsLoading(false)
    }
  }

  const deleteVerse = async (verseId: string) => {
    if (!confirm("Are you sure you want to delete this verse?")) return

    try {
      const response = await fetch(
        `/api/user/verses?userId=${encodeURIComponent(userId)}&verseId=${encodeURIComponent(verseId)}`,
        {
          method: "DELETE",
        },
      )

      if (response.ok) {
        setVerses(verses.filter((v) => v.id !== verseId))
      } else {
        setError("Failed to delete verse")
      }
    } catch (error) {
      console.error("Error deleting verse:", error)
      setError("Network error while deleting verse")
    }
  }

  // Get all unique tags
  const allTags = Array.from(new Set(verses.flatMap((verse) => verse.tags)))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading your saved verses...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Saved Verses</h2>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <Plus size={16} />
            Add Verse
          </button>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading verses</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={fetchVerses}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            Try Again
          </button>
        </div>

        {/* Add Verse Form Modal */}
        {showAddForm && (
          <AddVerseForm
            userId={userId}
            onClose={() => setShowAddForm(false)}
            onSave={(newVerse) => {
              setVerses([newVerse, ...verses])
              setShowAddForm(false)
              setError(null)
            }}
          />
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Saved Verses</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus size={16} />
          Add Verse
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search verses, references, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
        </div>

        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Tags</option>
          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {/* Verses List */}
      {filteredVerses.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {verses.length === 0 ? (
            <div>
              <p>No saved verses yet.</p>
              <p className="text-sm mt-2">Start saving verses to build your personal collection!</p>
            </div>
          ) : (
            <p>No verses match your search criteria.</p>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredVerses.map((verse) => (
            <div key={verse.id} className="bg-card border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-primary">{verse.reference}</h3>
                <div className="flex items-center gap-2">
                  {verse.isFavorite && <Heart className="text-red-500" size={16} />}
                  <button
                    onClick={() => deleteVerse(verse.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-foreground mb-3 leading-relaxed">{verse.text}</p>

              {verse.notes && (
                <div className="bg-muted/50 p-3 rounded-md mb-3">
                  <p className="text-sm text-muted-foreground italic">{verse.notes}</p>
                </div>
              )}

              {verse.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {verse.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                    >
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="text-xs text-muted-foreground">
                Saved on {new Date(verse.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Verse Form Modal */}
      {showAddForm && (
        <AddVerseForm
          userId={userId}
          onClose={() => setShowAddForm(false)}
          onSave={(newVerse) => {
            setVerses([newVerse, ...verses])
            setShowAddForm(false)
            setError(null)
          }}
        />
      )}
    </div>
  )
}

// Add Verse Form Component
interface AddVerseFormProps {
  userId: string
  onClose: () => void
  onSave: (verse: SavedVerse) => void
}

function AddVerseForm({ userId, onClose, onSave }: AddVerseFormProps) {
  const [formData, setFormData] = useState({
    reference: "",
    text: "",
    translation: "NIV",
    notes: "",
    tags: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.reference || !formData.text) {
      setError("Please fill in the reference and text fields.")
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)

      const response = await fetch("/api/user/verses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          reference: formData.reference,
          text: formData.text,
          translation: formData.translation,
          notes: formData.notes,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        onSave(data.verse)
      } else {
        throw new Error(data.error || "Failed to save verse")
      }
    } catch (error) {
      console.error("Error saving verse:", error)
      setError("Failed to save verse. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background w-full max-w-md rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Verse</h3>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Reference</label>
            <input
              type="text"
              placeholder="e.g., John 3:16"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Text</label>
            <textarea
              placeholder="Enter the verse text..."
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-full px-3 py-2 border rounded-md h-24"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Translation</label>
            <select
              value={formData.translation}
              onChange={(e) => setFormData({ ...formData, translation: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="NIV">NIV</option>
              <option value="ESV">ESV</option>
              <option value="KJV">KJV</option>
              <option value="NASB">NASB</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Notes (Optional)</label>
            <textarea
              placeholder="Add your personal notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border rounded-md h-20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags (Optional)</label>
            <input
              type="text"
              placeholder="faith, hope, love (comma separated)"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border rounded-md hover:bg-muted">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Verse"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
