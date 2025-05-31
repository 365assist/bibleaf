"use client"

import { useState, useEffect } from "react"
import { BibleService } from "@/lib/bible-service"

export default function TestBibleServicePage() {
  const [books, setBooks] = useState<Array<{ id: number; name: string; chapters: number }>>([])
  const [selectedBook, setSelectedBook] = useState<string>("Genesis")
  const [bookInfo, setBookInfo] = useState<{ id: number; name: string; chapters: number } | undefined>(undefined)
  const [importSuccess, setImportSuccess] = useState<boolean>(true)

  useEffect(() => {
    try {
      // Test getting all books
      const allBooks = BibleService.getAllBooks()
      setBooks(allBooks)

      // Test getting a specific book
      const genesis = BibleService.getBook("Genesis")
      setBookInfo(genesis)

      setImportSuccess(true)
    } catch (error) {
      console.error("Error importing BibleService:", error)
      setImportSuccess(false)
    }
  }, [])

  const handleBookSelect = (bookName: string) => {
    setSelectedBook(bookName)
    const book = BibleService.getBook(bookName)
    setBookInfo(book)
  }

  // Test book name variations
  const testVariations = () => {
    const variations = [
      { input: "psalm", expected: "Psalms" },
      { input: "Psalm", expected: "Psalms" },
      { input: "psalms", expected: "Psalms" },
      { input: "genesis", expected: "Genesis" },
      { input: "JOHN", expected: "John" },
      { input: "nonexistent", expected: undefined },
    ]

    return variations.map((v) => {
      const result = BibleService.getBook(v.input)
      const success = (result === undefined && v.expected === undefined) || (result && result.name === v.expected)

      return {
        input: v.input,
        expected: v.expected,
        actual: result?.name,
        success,
      }
    })
  }

  const variationResults = testVariations()

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">BibleService Import Test</h1>
        <div
          className={`px-4 py-2 rounded-md ${importSuccess ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          Import Status: {importSuccess ? "Success ✅" : "Failed ❌"}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">All Books ({books.length})</h2>
          <div className="h-64 overflow-y-auto pr-2">
            <ul className="space-y-1">
              {books.map((book) => (
                <li
                  key={book.id}
                  className={`px-3 py-2 rounded cursor-pointer ${selectedBook === book.name ? "bg-amber-100 text-amber-800" : "hover:bg-gray-100"}`}
                  onClick={() => handleBookSelect(book.name)}
                >
                  {book.name} ({book.chapters} chapters)
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Selected Book Info</h2>
          {bookInfo ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Name:</span>
                <span>{bookInfo.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">ID:</span>
                <span>{bookInfo.id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Chapters:</span>
                <span>{bookInfo.chapters}</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: bookInfo.chapters }, (_, i) => i + 1).map((chapter) => (
                    <a
                      key={chapter}
                      href={`/bible/${bookInfo.name}/${chapter}`}
                      className="px-3 py-2 text-center bg-gray-100 hover:bg-amber-100 rounded"
                    >
                      {chapter}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 italic">No book selected</div>
          )}
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Book Name Variation Tests</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Input</th>
              <th className="text-left py-2">Expected</th>
              <th className="text-left py-2">Actual</th>
              <th className="text-left py-2">Result</th>
            </tr>
          </thead>
          <tbody>
            {variationResults.map((result, index) => (
              <tr key={index} className="border-b">
                <td className="py-2">{result.input}</td>
                <td className="py-2">{result.expected || "undefined"}</td>
                <td className="py-2">{result.actual || "undefined"}</td>
                <td className="py-2">
                  <span className={result.success ? "text-green-600" : "text-red-600"}>
                    {result.success ? "✅ Pass" : "❌ Fail"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <h2 className="text-xl font-semibold mb-4">BibleService Methods</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">BibleService.getAllBooks()</h3>
            <p className="text-sm text-gray-600">Returns an array of all Bible books with their chapter counts</p>
            <pre className="mt-2 p-3 bg-gray-100 rounded overflow-x-auto">
              {`const allBooks = BibleService.getAllBooks();
// Returns: [{ id: 1, name: "Genesis", chapters: 50 }, ...]`}
            </pre>
          </div>

          <div>
            <h3 className="font-medium">BibleService.getBook(name: string)</h3>
            <p className="text-sm text-gray-600">Returns book information for a given book name</p>
            <pre className="mt-2 p-3 bg-gray-100 rounded overflow-x-auto">
              {`const genesis = BibleService.getBook("Genesis");
// Returns: { id: 1, name: "Genesis", chapters: 50 }`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
