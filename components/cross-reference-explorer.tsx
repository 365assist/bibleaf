"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Heart,
  ArrowRight,
  Network,
  Filter,
  ChevronDown,
  ChevronRight,
  Star,
  LinkIcon,
  Lightbulb,
  Quote,
} from "lucide-react"
import Link from "next/link"

interface CrossReference {
  reference: string
  text: string
  relationship: "parallel" | "contrast" | "explanation" | "fulfillment" | "example" | "prophecy" | "quotation"
  relevanceScore: number
  context?: string
  theme?: string
  testament: "Old" | "New"
  book: string
  chapter: number
  verse: number
}

interface ThematicGroup {
  theme: string
  description: string
  references: CrossReference[]
  color: string
}

interface CrossReferenceExplorerProps {
  reference: string
  initialText?: string
  onSaveVerse?: (verse: { reference: string; text: string }) => void
  onClose?: () => void
}

export default function CrossReferenceExplorer({
  reference,
  initialText,
  onSaveVerse,
  onClose,
}: CrossReferenceExplorerProps) {
  const [crossReferences, setCrossReferences] = useState<CrossReference[]>([])
  const [thematicGroups, setThematicGroups] = useState<ThematicGroup[]>([])
  const [selectedReference, setSelectedReference] = useState<CrossReference | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeView, setActiveView] = useState<"list" | "network" | "thematic">("list")
  const [filters, setFilters] = useState({
    testament: "all",
    relationship: "all",
    minRelevance: 0.5,
  })
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadCrossReferences()
  }, [reference])

  const loadCrossReferences = async () => {
    setIsLoading(true)
    try {
      // This would fetch from your cross-reference API
      const response = await fetch(`/api/bible/cross-references?reference=${reference}`)
      const data = await response.json()
      setCrossReferences(data.references || [])
      setThematicGroups(data.thematicGroups || [])
    } catch (error) {
      console.error("Failed to load cross-references:", error)
      // Fallback sample data based on the reference
      loadSampleCrossReferences()
    } finally {
      setIsLoading(false)
    }
  }

  const loadSampleCrossReferences = () => {
    // Sample cross-references for demonstration
    const sampleReferences: CrossReference[] = [
      {
        reference: "Romans 5:8",
        text: "But God demonstrates his own love for us in this: While we were still sinners, Christ died for us.",
        relationship: "parallel",
        relevanceScore: 0.95,
        context: "Demonstrates God's love through Christ's sacrifice",
        theme: "God's Love",
        testament: "New",
        book: "Romans",
        chapter: 5,
        verse: 8,
      },
      {
        reference: "1 John 4:9",
        text: "This is how God showed his love among us: He sent his one and only Son into the world that we might live through him.",
        relationship: "explanation",
        relevanceScore: 0.92,
        context: "Explains how God's love is demonstrated",
        theme: "God's Love",
        testament: "New",
        book: "1 John",
        chapter: 4,
        verse: 9,
      },
      {
        reference: "Ephesians 2:4-5",
        text: "But because of his great love for us, God, who is rich in mercy, made us alive with Christ even when we were dead in transgressions—it is by grace you have been saved.",
        relationship: "parallel",
        relevanceScore: 0.88,
        context: "God's love expressed through grace and mercy",
        theme: "Grace and Mercy",
        testament: "New",
        book: "Ephesians",
        chapter: 2,
        verse: 4,
      },
      {
        reference: "Isaiah 53:5",
        text: "But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.",
        relationship: "prophecy",
        relevanceScore: 0.85,
        context: "Prophetic fulfillment of Christ's sacrifice",
        theme: "Messianic Prophecy",
        testament: "Old",
        book: "Isaiah",
        chapter: 53,
        verse: 5,
      },
      {
        reference: "Titus 3:4-5",
        text: "But when the kindness and love of God our Savior appeared, he saved us, not because of righteous things we had done, but because of his mercy.",
        relationship: "parallel",
        relevanceScore: 0.82,
        context: "Salvation through God's kindness and mercy",
        theme: "Salvation",
        testament: "New",
        book: "Titus",
        chapter: 3,
        verse: 4,
      },
      {
        reference: "Jeremiah 31:3",
        text: "The Lord appeared to us in the past, saying: 'I have loved you with an everlasting love; I have drawn you with unfailing kindness.'",
        relationship: "parallel",
        relevanceScore: 0.78,
        context: "God's everlasting love for His people",
        theme: "God's Love",
        testament: "Old",
        book: "Jeremiah",
        chapter: 31,
        verse: 3,
      },
    ]

    const sampleThematicGroups: ThematicGroup[] = [
      {
        theme: "God's Love",
        description: "Passages that reveal the nature and expression of God's love",
        color: "bg-red-100 text-red-800 border-red-200",
        references: sampleReferences.filter((ref) => ref.theme === "God's Love"),
      },
      {
        theme: "Grace and Mercy",
        description: "Verses about God's unmerited favor and compassion",
        color: "bg-blue-100 text-blue-800 border-blue-200",
        references: sampleReferences.filter((ref) => ref.theme === "Grace and Mercy"),
      },
      {
        theme: "Salvation",
        description: "Passages about God's plan of redemption",
        color: "bg-green-100 text-green-800 border-green-200",
        references: sampleReferences.filter((ref) => ref.theme === "Salvation"),
      },
      {
        theme: "Messianic Prophecy",
        description: "Old Testament prophecies fulfilled in Christ",
        color: "bg-purple-100 text-purple-800 border-purple-200",
        references: sampleReferences.filter((ref) => ref.theme === "Messianic Prophecy"),
      },
    ]

    setCrossReferences(sampleReferences)
    setThematicGroups(sampleThematicGroups)
  }

  const getRelationshipIcon = (relationship: string) => {
    switch (relationship) {
      case "parallel":
        return <ArrowRight className="w-4 h-4" />
      case "contrast":
        return <Network className="w-4 h-4" />
      case "explanation":
        return <Lightbulb className="w-4 h-4" />
      case "fulfillment":
        return <Star className="w-4 h-4" />
      case "example":
        return <Quote className="w-4 h-4" />
      case "prophecy":
        return <Star className="w-4 h-4" />
      case "quotation":
        return <Quote className="w-4 h-4" />
      default:
        return <LinkIcon className="w-4 h-4" />
    }
  }

  const getRelationshipColor = (relationship: string) => {
    switch (relationship) {
      case "parallel":
        return "bg-blue-100 text-blue-800"
      case "contrast":
        return "bg-orange-100 text-orange-800"
      case "explanation":
        return "bg-green-100 text-green-800"
      case "fulfillment":
        return "bg-purple-100 text-purple-800"
      case "example":
        return "bg-yellow-100 text-yellow-800"
      case "prophecy":
        return "bg-indigo-100 text-indigo-800"
      case "quotation":
        return "bg-pink-100 text-pink-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredReferences = crossReferences.filter((ref) => {
    if (filters.testament !== "all" && ref.testament !== filters.testament) return false
    if (filters.relationship !== "all" && ref.relationship !== filters.relationship) return false
    if (ref.relevanceScore < filters.minRelevance) return false
    return true
  })

  const toggleGroupExpansion = (theme: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(theme)) {
      newExpanded.delete(theme)
    } else {
      newExpanded.add(theme)
    }
    setExpandedGroups(newExpanded)
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-6xl mx-auto">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Network className="w-6 h-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl">Cross-References for {reference}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Explore {crossReferences.length} related passages that illuminate this verse
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveView(activeView === "list" ? "thematic" : "list")}
              >
                {activeView === "list" ? "Thematic View" : "List View"}
              </Button>
              {onClose && (
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Original Verse Context */}
      {initialText && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-1 h-16 bg-blue-500 rounded-full"></div>
              <div>
                <h3 className="font-semibold text-lg text-blue-800 mb-2">{reference}</h3>
                <p className="text-gray-700 leading-relaxed">{initialText}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filters:</span>
            </div>

            <select
              value={filters.testament}
              onChange={(e) => setFilters((prev) => ({ ...prev, testament: e.target.value }))}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="all">All Testament</option>
              <option value="Old">Old Testament</option>
              <option value="New">New Testament</option>
            </select>

            <select
              value={filters.relationship}
              onChange={(e) => setFilters((prev) => ({ ...prev, relationship: e.target.value }))}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="all">All Relationships</option>
              <option value="parallel">Parallel</option>
              <option value="explanation">Explanation</option>
              <option value="fulfillment">Fulfillment</option>
              <option value="prophecy">Prophecy</option>
              <option value="example">Example</option>
              <option value="contrast">Contrast</option>
            </select>

            <div className="flex items-center gap-2">
              <span className="text-sm">Min Relevance:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={filters.minRelevance}
                onChange={(e) => setFilters((prev) => ({ ...prev, minRelevance: Number.parseFloat(e.target.value) }))}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">{Math.round(filters.minRelevance * 100)}%</span>
            </div>

            <Badge variant="outline">{filteredReferences.length} references found</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeView} onValueChange={(value) => setActiveView(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="thematic">Thematic Groups</TabsTrigger>
          <TabsTrigger value="network">Network View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reference List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredReferences.map((ref, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedReference?.reference === ref.reference ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedReference(ref)}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold text-blue-700">{ref.reference}</h4>
                          <Badge className={getRelationshipColor(ref.relationship)} variant="outline">
                            <span className="flex items-center gap-1">
                              {getRelationshipIcon(ref.relationship)}
                              {ref.relationship}
                            </span>
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {Math.round(ref.relevanceScore * 100)}% match
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              if (onSaveVerse) {
                                onSaveVerse({ reference: ref.reference, text: ref.text })
                              }
                            }}
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-gray-700 leading-relaxed">{ref.text}</p>

                      {ref.context && (
                        <div className="p-3 bg-blue-50 rounded border-l-2 border-blue-300">
                          <p className="text-sm text-blue-800">
                            <strong>Connection:</strong> {ref.context}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          {ref.testament} Testament • {ref.book}
                        </span>
                        <Link
                          href={`/bible/${ref.book}/${ref.chapter}?verse=${ref.verse}`}
                          className="text-blue-600 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Read in context →
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Selected Reference Details */}
            <div className="lg:col-span-1">
              {selectedReference ? (
                <Card className="sticky top-4">
                  <CardHeader>
                    <CardTitle className="text-lg">{selectedReference.reference}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Relationship Type</h4>
                      <Badge className={getRelationshipColor(selectedReference.relationship)}>
                        <span className="flex items-center gap-1">
                          {getRelationshipIcon(selectedReference.relationship)}
                          {selectedReference.relationship}
                        </span>
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Relevance Score</h4>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${selectedReference.relevanceScore * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{Math.round(selectedReference.relevanceScore * 100)}%</span>
                      </div>
                    </div>

                    {selectedReference.theme && (
                      <div>
                        <h4 className="font-medium mb-2">Theme</h4>
                        <Badge variant="outline">{selectedReference.theme}</Badge>
                      </div>
                    )}

                    <div>
                      <h4 className="font-medium mb-2">Actions</h4>
                      <div className="space-y-2">
                        <Link href={`/bible/${selectedReference.book}/${selectedReference.chapter}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Read Chapter
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            // This would open the cross-reference explorer for the selected reference
                            console.log("Explore cross-references for:", selectedReference.reference)
                          }}
                        >
                          <Network className="w-4 h-4 mr-2" />
                          Explore Cross-Refs
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => {
                            if (onSaveVerse) {
                              onSaveVerse({
                                reference: selectedReference.reference,
                                text: selectedReference.text,
                              })
                            }
                          }}
                        >
                          <Heart className="w-4 h-4 mr-2" />
                          Save Verse
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="sticky top-4">
                  <CardContent className="p-8 text-center">
                    <Network className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Click on a cross-reference to see detailed information and explore connections
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="thematic" className="mt-6">
          <div className="space-y-6">
            {thematicGroups.map((group) => (
              <Card key={group.theme}>
                <CardHeader>
                  <button
                    onClick={() => toggleGroupExpansion(group.theme)}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-3">
                      {expandedGroups.has(group.theme) ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                      <CardTitle className="text-lg">{group.theme}</CardTitle>
                      <Badge className={group.color}>{group.references.length} verses</Badge>
                    </div>
                  </button>
                  <p className="text-sm text-muted-foreground ml-8">{group.description}</p>
                </CardHeader>

                {expandedGroups.has(group.theme) && (
                  <CardContent>
                    <div className="space-y-4">
                      {group.references.map((ref, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-blue-700">{ref.reference}</h4>
                            <div className="flex gap-2">
                              <Badge className={getRelationshipColor(ref.relationship)} variant="outline">
                                {ref.relationship}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  if (onSaveVerse) {
                                    onSaveVerse({ reference: ref.reference, text: ref.text })
                                  }
                                }}
                              >
                                <Heart className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-2">{ref.text}</p>
                          {ref.context && <p className="text-sm text-blue-700 italic">Connection: {ref.context}</p>}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="network" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Network Visualization</CardTitle>
              <p className="text-sm text-muted-foreground">
                Interactive network showing relationships between verses (Coming Soon)
              </p>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-gray-50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Network className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Interactive Network Visualization</p>
                  <p className="text-sm text-gray-500">
                    This feature will show an interactive graph of verse relationships, allowing you to explore
                    connections visually.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Study Tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Study Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <span className="font-semibold">Parallel Passages</span>
              <span className="text-xs text-muted-foreground mt-1">Find similar teachings</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <span className="font-semibold">Word Studies</span>
              <span className="text-xs text-muted-foreground mt-1">Explore original meanings</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <span className="font-semibold">Commentary Notes</span>
              <span className="text-xs text-muted-foreground mt-1">Scholar insights</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <span className="font-semibold">Topical Study</span>
              <span className="text-xs text-muted-foreground mt-1">Thematic exploration</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
