"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, BookOpen, Calendar, Star, ThumbsUp, Share2, Bookmark, X } from "lucide-react"

interface Commentary {
  id: string
  author: string
  title: string
  excerpt: string
  fullText: string
  year: number
  tradition: "Reformed" | "Catholic" | "Orthodox" | "Evangelical" | "Historical"
  rating: number
  helpful: number
  source: string
}

interface CommentaryNotesProps {
  reference: string
  verse?: number
  onClose?: () => void
}

export default function CommentaryNotes({ reference, verse, onClose }: CommentaryNotesProps) {
  const [commentaries, setCommentaries] = useState<Commentary[]>([])
  const [selectedCommentary, setSelectedCommentary] = useState<Commentary | null>(null)
  const [selectedTradition, setSelectedTradition] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCommentaries()
  }, [reference, verse])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose()
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  const loadCommentaries = async () => {
    setIsLoading(true)
    try {
      // This would fetch from your commentary API
      const response = await fetch(`/api/bible/commentary?reference=${reference}&verse=${verse || ""}`)
      const data = await response.json()
      setCommentaries(data)
    } catch (error) {
      console.error("Failed to load commentaries:", error)
      // Fallback sample data
      setCommentaries([
        {
          id: "1",
          author: "Matthew Henry",
          title: "Matthew Henry's Complete Commentary",
          excerpt:
            "This verse reveals the heart of the Gospel - God's love demonstrated through the gift of His Son...",
          fullText:
            "This verse reveals the heart of the Gospel - God's love demonstrated through the gift of His Son. The word 'so' (οὕτως) indicates not just the degree but the manner of God's love. It was love that moved God to give, and it was such a love as had never been known before. The gift was His only-begotten Son, which speaks both of the dignity of the person given and the greatness of the love that gave him.",
          year: 1708,
          tradition: "Reformed",
          rating: 4.8,
          helpful: 1247,
          source: "Public Domain",
        },
        {
          id: "2",
          author: "John Chrysostom",
          title: "Homilies on the Gospel of John",
          excerpt: "What is the meaning of 'He gave'? It means He delivered Him up to death for us all...",
          fullText:
            "What is the meaning of 'He gave'? It means He delivered Him up to death for us all. And what is 'His only-begotten Son'? The Son who is truly begotten, not adopted; the Son who is of the same essence as the Father. This shows the exceeding greatness of His love for us, that He spared not His own Son, but delivered Him up for us all.",
          year: 390,
          tradition: "Orthodox",
          rating: 4.9,
          helpful: 892,
          source: "Early Church Fathers",
        },
        {
          id: "3",
          author: "John Calvin",
          title: "Calvin's Commentary on John",
          excerpt: "The love of God toward the human race is here declared to be the cause of our salvation...",
          fullText:
            "The love of God toward the human race is here declared to be the cause of our salvation. When we hear that God so loved the world, let us learn that there is nothing in ourselves to attract the love of God, but that it flows from the fountain of His mercy alone. The word 'world' is used here to denote the human race, showing that God's love extends to all mankind without exception.",
          year: 1553,
          tradition: "Reformed",
          rating: 4.7,
          helpful: 1089,
          source: "Public Domain",
        },
        {
          id: "4",
          author: "Thomas Aquinas",
          title: "Commentary on the Gospel of John",
          excerpt:
            "God's love is shown in three ways: in the universality of those loved, the excellence of the gift, and the purpose of giving...",
          fullText:
            "God's love is shown in three ways: in the universality of those loved ('the world'), in the excellence of the gift ('His only-begotten Son'), and in the purpose of giving ('that whoever believes in Him should not perish but have eternal life'). The phrase 'only-begotten' signifies that Christ is the natural Son of God, not by adoption but by nature.",
          year: 1270,
          tradition: "Catholic",
          rating: 4.6,
          helpful: 743,
          source: "Medieval Commentaries",
        },
        {
          id: "5",
          author: "Charles Spurgeon",
          title: "The Treasury of David",
          excerpt:
            "Here is love! Not that we loved God, but that He loved us. Here is wonder! The infinite loving the finite...",
          fullText:
            "Here is love! Not that we loved God, but that He loved us. Here is wonder! The infinite loving the finite, the holy loving the unholy, the blessed loving the miserable. Here is love - not mere pity or compassion, but love in all its fullness. God so loved - with such a love, so great, so rich, so free, so lasting, that He gave His only-begotten Son.",
          year: 1885,
          tradition: "Evangelical",
          rating: 4.9,
          helpful: 1456,
          source: "Public Domain",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCommentaries =
    selectedTradition === "all" ? commentaries : commentaries.filter((c) => c.tradition === selectedTradition)

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-green-600" />
              <div>
                <CardTitle className="text-xl">
                  Commentary Notes - {reference}
                  {verse ? `:${verse}` : ""}
                </CardTitle>
                <p className="text-sm text-muted-foreground">Insights from trusted biblical scholars and theologians</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedTradition}
                onChange={(e) => setSelectedTradition(e.target.value)}
                className="px-3 py-1 border rounded-lg text-sm"
              >
                <option value="all">All Traditions</option>
                <option value="Reformed">Reformed</option>
                <option value="Catholic">Catholic</option>
                <option value="Orthodox">Orthodox</option>
                <option value="Evangelical">Evangelical</option>
                <option value="Historical">Historical</option>
              </select>
              {onClose && (
                <>
                  <Button variant="outline" onClick={onClose} className="px-4">
                    Close
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
                    <X className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Commentary List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Available Commentaries</CardTitle>
              <p className="text-sm text-muted-foreground">{filteredCommentaries.length} commentaries found</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredCommentaries.map((commentary) => (
                  <button
                    key={commentary.id}
                    onClick={() => setSelectedCommentary(commentary)}
                    className={`w-full p-4 text-left rounded-lg border transition-all ${
                      selectedCommentary?.id === commentary.id
                        ? "bg-green-50 border-green-300"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-sm leading-tight">{commentary.author}</h4>
                        <Badge variant="outline" className="text-xs">
                          {commentary.tradition}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground">{commentary.title}</p>

                      <p className="text-xs text-gray-600 line-clamp-2">{commentary.excerpt}</p>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {commentary.year}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {commentary.rating}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Commentary Details */}
        <div className="lg:col-span-2">
          {selectedCommentary ? (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-xl">{selectedCommentary.author}</CardTitle>
                    <p className="text-muted-foreground">{selectedCommentary.title}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {selectedCommentary.year}
                      </span>
                      <Badge variant="outline">{selectedCommentary.tradition}</Badge>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {selectedCommentary.rating}/5
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-4 h-4" />
                        {selectedCommentary.helpful} helpful
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Bookmark className="w-4 h-4 mr-2" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="commentary" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="commentary">Commentary</TabsTrigger>
                    <TabsTrigger value="context">Historical Context</TabsTrigger>
                    <TabsTrigger value="application">Application</TabsTrigger>
                  </TabsList>

                  <TabsContent value="commentary" className="mt-6">
                    <div className="space-y-4">
                      <div className="max-w-none">
                        <p className="leading-loose text-gray-900 text-base font-medium">
                          {selectedCommentary.fullText}
                        </p>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2">Key Insights</h4>
                        <ul className="space-y-1 text-blue-700 text-sm">
                          <li>• God's love is the primary motivation for salvation</li>
                          <li>• The gift of Christ demonstrates the magnitude of divine love</li>
                          <li>• Eternal life is available to all who believe</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="context" className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Historical Background</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          Written during the{" "}
                          {selectedCommentary.year < 500
                            ? "early church period"
                            : selectedCommentary.year < 1500
                              ? "medieval period"
                              : "reformation era"}
                          , this commentary reflects the theological understanding and pastoral concerns of its time.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Theological Tradition</h4>
                        <p className="text-muted-foreground leading-relaxed">
                          As a {selectedCommentary.tradition} scholar, {selectedCommentary.author}
                          approaches this text with particular emphasis on
                          {selectedCommentary.tradition === "Reformed"
                            ? " God's sovereignty and grace"
                            : selectedCommentary.tradition === "Catholic"
                              ? " church tradition and sacramental theology"
                              : selectedCommentary.tradition === "Orthodox"
                                ? " patristic wisdom and mystical theology"
                                : " biblical authority and personal faith"}
                          .
                        </p>
                      </div>

                      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <h4 className="font-semibold text-amber-800 mb-2">Source Information</h4>
                        <p className="text-amber-700 text-sm">
                          Source: {selectedCommentary.source} | Originally published: {selectedCommentary.year} |
                          Tradition: {selectedCommentary.tradition}
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="application" className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Practical Application</h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-green-50 rounded border-l-4 border-green-400">
                            <h5 className="font-medium text-green-800">Personal Reflection</h5>
                            <p className="text-green-700 text-sm mt-1">
                              How does understanding God's love change your perspective on daily challenges?
                            </p>
                          </div>

                          <div className="p-3 bg-purple-50 rounded border-l-4 border-purple-400">
                            <h5 className="font-medium text-purple-800">Community Impact</h5>
                            <p className="text-purple-700 text-sm mt-1">
                              How can this truth about God's love be shared with others in practical ways?
                            </p>
                          </div>

                          <div className="p-3 bg-orange-50 rounded border-l-4 border-orange-400">
                            <h5 className="font-medium text-orange-800">Spiritual Growth</h5>
                            <p className="text-orange-700 text-sm mt-1">
                              What steps can you take to deepen your understanding and experience of God's love?
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Discussion Questions</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>1. What does it mean that God "so loved" the world?</li>
                          <li>2. How does the gift of Christ demonstrate the nature of divine love?</li>
                          <li>3. What is the relationship between belief and eternal life?</li>
                          <li>4. How should this verse shape our understanding of evangelism?</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Select a commentary from the list to read detailed notes and insights
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Additional Study Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <span className="font-semibold">Cross-References</span>
              <span className="text-xs text-muted-foreground mt-1">Explore related passages</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <span className="font-semibold">Word Studies</span>
              <span className="text-xs text-muted-foreground mt-1">Original language analysis</span>
            </Button>

            <Button variant="outline" className="h-auto p-4 flex flex-col items-start">
              <span className="font-semibold">Sermon Notes</span>
              <span className="text-xs text-muted-foreground mt-1">Preaching insights and outlines</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
