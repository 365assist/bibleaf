"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Languages, BookOpen, Search, Volume2 } from "lucide-react"

interface OriginalWord {
  word: string
  transliteration: string
  strongsNumber: string
  partOfSpeech: string
  definition: string
  etymology: string
  usage: string[]
  relatedWords: string[]
}

interface OriginalLanguageData {
  reference: string
  originalText: string
  language: "Hebrew" | "Greek"
  words: OriginalWord[]
  grammaticalNotes: string
  textualVariants?: string[]
}

interface OriginalLanguageViewerProps {
  reference: string
  onClose?: () => void
}

export default function OriginalLanguageViewer({ reference, onClose }: OriginalLanguageViewerProps) {
  const [data, setData] = useState<OriginalLanguageData | null>(null)
  const [selectedWord, setSelectedWord] = useState<OriginalWord | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadOriginalLanguageData()
  }, [reference])

  const loadOriginalLanguageData = async () => {
    setIsLoading(true)
    try {
      // This would fetch from your original language API
      const response = await fetch(`/api/bible/original-language?reference=${reference}`)
      const languageData = await response.json()
      setData(languageData)
    } catch (error) {
      console.error("Failed to load original language data:", error)
      // Fallback sample data for demonstration
      setData({
        reference: "John 3:16",
        originalText:
          "οὕτως γὰρ ἠγάπησεν ὁ θεὸς τὸν κόσμον, ὥστε τὸν υἱὸν τὸν μονογενῆ ἔδωκεν, ἵνα πᾶς ὁ πιστεύων εἰς αὐτὸν μὴ ἀπόληται ἀλλὰ ἔχῃ ζωὴν αἰώνιον.",
        language: "Greek",
        words: [
          {
            word: "ἠγάπησεν",
            transliteration: "ēgapēsen",
            strongsNumber: "G25",
            partOfSpeech: "Verb - Aorist Active Indicative - 3rd Person Singular",
            definition: "to love, have affection for, take pleasure in",
            etymology: "From agape (love); to love in a moral or social sense",
            usage: ["unconditional love", "divine love", "sacrificial love"],
            relatedWords: ["ἀγάπη (agape)", "ἀγαπητός (agapetos)"],
          },
          {
            word: "μονογενῆ",
            transliteration: "monogenē",
            strongsNumber: "G3439",
            partOfSpeech: "Adjective - Accusative Masculine Singular",
            definition: "only begotten, unique, one of a kind",
            etymology: "From monos (single) and genos (offspring)",
            usage: ["unique relationship", "only child", "one and only"],
            relatedWords: ["μόνος (monos)", "γένος (genos)"],
          },
          {
            word: "αἰώνιον",
            transliteration: "aiōnion",
            strongsNumber: "G166",
            partOfSpeech: "Adjective - Accusative Feminine Singular",
            definition: "eternal, everlasting, without beginning or end",
            etymology: "From aion (age, eternity)",
            usage: ["eternal life", "everlasting", "age-lasting"],
            relatedWords: ["αἰών (aion)", "αἰώνιος (aionios)"],
          },
        ],
        grammaticalNotes:
          "The aorist tense of ἠγάπησεν indicates a completed action in the past, emphasizing the decisive nature of God's love demonstrated in sending Christ.",
        textualVariants: ["Some manuscripts read τὸν υἱὸν αὐτοῦ instead of τὸν υἱὸν τὸν μονογενῆ"],
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Original language data not available for this verse.</p>
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
              <Languages className="w-6 h-6 text-blue-600" />
              <div>
                <CardTitle className="text-xl">
                  {data.reference} - Original {data.language}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Explore the original biblical text with word-by-word analysis
                </p>
              </div>
            </div>
            {onClose && (
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Original Text Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Original {data.language} Text
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
              <p
                className="text-2xl leading-relaxed font-serif text-center"
                dir={data.language === "Hebrew" ? "rtl" : "ltr"}
                style={{ fontFamily: data.language === "Hebrew" ? "SBL Hebrew, serif" : "SBL Greek, serif" }}
              >
                {data.originalText}
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <Button variant="outline" size="sm">
                <Volume2 className="w-4 h-4 mr-2" />
                Listen to Pronunciation
              </Button>
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4 mr-2" />
                Search Similar Passages
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Word Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Word List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Words</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {data.words.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedWord(word)}
                    className={`w-full p-3 text-left rounded-lg border transition-all ${
                      selectedWord?.word === word.word
                        ? "bg-blue-50 border-blue-300"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="space-y-1">
                      <p className="font-mono text-lg" dir={data.language === "Hebrew" ? "rtl" : "ltr"}>
                        {word.word}
                      </p>
                      <p className="text-sm text-blue-600">{word.transliteration}</p>
                      <p className="text-xs text-muted-foreground">{word.partOfSpeech}</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Word Details */}
        <div className="lg:col-span-2">
          {selectedWord ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <span className="font-mono text-2xl" dir={data.language === "Hebrew" ? "rtl" : "ltr"}>
                    {selectedWord.word}
                  </span>
                  <span className="text-lg text-blue-600">({selectedWord.transliteration})</span>
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Strong's {selectedWord.strongsNumber} • {selectedWord.partOfSpeech}
                </p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="definition" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="definition">Definition</TabsTrigger>
                    <TabsTrigger value="etymology">Etymology</TabsTrigger>
                    <TabsTrigger value="usage">Usage</TabsTrigger>
                    <TabsTrigger value="related">Related</TabsTrigger>
                  </TabsList>

                  <TabsContent value="definition" className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Primary Definition</h4>
                        <p className="text-muted-foreground leading-relaxed">{selectedWord.definition}</p>
                      </div>

                      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <h4 className="font-semibold text-amber-800 mb-2">Theological Significance</h4>
                        <p className="text-amber-700 text-sm leading-relaxed">
                          This word carries deep theological meaning in its original context, emphasizing the unique
                          nature of God's action and character.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="etymology" className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Word Origin</h4>
                        <p className="text-muted-foreground leading-relaxed">{selectedWord.etymology}</p>
                      </div>

                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-2">Historical Development</h4>
                        <p className="text-blue-700 text-sm leading-relaxed">
                          The word evolved through various periods of {data.language} literature, gaining richer
                          theological meaning in biblical usage.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="usage" className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-3">Common Biblical Usage</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {selectedWord.usage.map((use, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg">
                              <span className="text-sm font-medium">{use}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Other Biblical Occurrences</h4>
                        <div className="space-y-2">
                          <button className="w-full p-2 text-left bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                            <span className="text-sm font-medium text-blue-600">Romans 5:8</span>
                            <p className="text-xs text-muted-foreground mt-1">Similar usage in context of God's love</p>
                          </button>
                          <button className="w-full p-2 text-left bg-gray-50 rounded hover:bg-gray-100 transition-colors">
                            <span className="text-sm font-medium text-blue-600">1 John 4:9</span>
                            <p className="text-xs text-muted-foreground mt-1">Parallel passage with same word</p>
                          </button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="related" className="mt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-3">Related Words</h4>
                        <div className="space-y-2">
                          {selectedWord.relatedWords.map((relatedWord, index) => (
                            <button
                              key={index}
                              className="w-full p-3 text-left bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                            >
                              <span className="font-mono" dir={data.language === "Hebrew" ? "rtl" : "ltr"}>
                                {relatedWord}
                              </span>
                              <p className="text-xs text-muted-foreground mt-1">Click to explore this related word</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Languages className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Select a word from the list to see detailed analysis</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Grammatical Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Grammatical Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground leading-relaxed">{data.grammaticalNotes}</p>

            {data.textualVariants && data.textualVariants.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">Textual Variants</h4>
                <ul className="space-y-1">
                  {data.textualVariants.map((variant, index) => (
                    <li key={index} className="text-yellow-700 text-sm">
                      • {variant}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
