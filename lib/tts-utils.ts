/**
 * Formats text for optimal text-to-speech reading
 * @param text The text to format
 * @returns Formatted text optimized for TTS
 */
export function formatTextForSpeech(text: string): string {
  // Add pauses after punctuation
  let formattedText = text
    .replace(/\./g, ". ") // Add slight pause after periods
    .replace(/,/g, ", ") // Add slight pause after commas
    .replace(/;/g, "; ") // Add pause after semicolons
    .replace(/:/g, ": ") // Add pause after colons
    .replace(/!/g, "! ") // Add pause after exclamation marks
    .replace(/\?/g, "? ") // Add pause after question marks
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space

  // Add pause between Bible reference and text if needed
  if (formattedText.includes(" - ")) {
    formattedText = formattedText.replace(" - ", "... ")
  }

  return formattedText.trim()
}

/**
 * Extracts the main content from a Bible verse for TTS
 * @param reference The verse reference
 * @param text The verse text
 * @returns Formatted text for TTS
 */
export function formatVerseForSpeech(reference: string, text: string): string {
  return `${reference}. ${text}`
}

/**
 * Formats guidance text for TTS by breaking it into manageable chunks
 * @param text The guidance text
 * @returns An array of text chunks for sequential TTS playback
 */
export function chunkGuidanceForSpeech(text: string): string[] {
  // Split by paragraphs first
  const paragraphs = text.split(/\n+/)

  const chunks: string[] = []

  // Process each paragraph
  for (const paragraph of paragraphs) {
    // If paragraph is short enough, add it as is
    if (paragraph.length < 300) {
      chunks.push(paragraph)
    } else {
      // Split long paragraphs by sentences
      const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || []
      let currentChunk = ""

      for (const sentence of sentences) {
        if (currentChunk.length + sentence.length < 300) {
          currentChunk += sentence
        } else {
          chunks.push(currentChunk)
          currentChunk = sentence
        }
      }

      if (currentChunk) {
        chunks.push(currentChunk)
      }
    }
  }

  return chunks
}
