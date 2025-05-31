import TTSDemo from "@/components/tts-demo"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TTSDemoPage() {
  return (
    <div className="container py-8">
      <Link href="/dashboard" className="flex items-center gap-2 text-primary hover:underline mb-6">
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-6">Text-to-Speech with Voice Selection</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <p className="mb-4">
            This enhanced demo showcases the text-to-speech functionality with voice selection using ElevenLabs API. You
            can choose from different voices and customize voice parameters.
          </p>

          <h3 className="text-lg font-semibold mb-2">Features:</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>Choose from multiple ElevenLabs voices</li>
            <li>Preview voices before selecting</li>
            <li>Adjust voice stability and similarity boost</li>
            <li>Settings are saved locally</li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">Voice Categories:</h3>
          <ul className="list-disc list-inside space-y-2 mb-4">
            <li>
              <strong>Premade:</strong> Professional, high-quality voices
            </li>
            <li>
              <strong>Cloned:</strong> Custom cloned voices
            </li>
            <li>
              <strong>Generated:</strong> AI-generated voices
            </li>
          </ul>

          <h3 className="text-lg font-semibold mb-2">Voice Parameters:</h3>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Stability:</strong> Controls voice consistency (0-1)
            </li>
            <li>
              <strong>Similarity Boost:</strong> Enhances voice similarity (0-1)
            </li>
          </ul>
        </div>

        <TTSDemo />
      </div>

      <div className="mt-12 p-6 bg-muted/30 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Integration Examples</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 bg-background rounded-lg border">
            <h3 className="font-semibold mb-2">Bible Verses</h3>
            <p className="text-sm text-muted-foreground">
              Each verse can be read aloud with the user's preferred voice, making Bible study accessible for visual
              impairments or multitasking.
            </p>
          </div>
          <div className="p-4 bg-background rounded-lg border">
            <h3 className="font-semibold mb-2">Life Guidance</h3>
            <p className="text-sm text-muted-foreground">
              Long guidance responses can be converted to audio, allowing users to listen while walking, driving, or
              relaxing.
            </p>
          </div>
          <div className="p-4 bg-background rounded-lg border">
            <h3 className="font-semibold mb-2">Daily Verses</h3>
            <p className="text-sm text-muted-foreground">
              Morning devotions can include audio playback of the daily verse, creating a more immersive spiritual
              experience.
            </p>
          </div>
          <div className="p-4 bg-background rounded-lg border">
            <h3 className="font-semibold mb-2">Study Notes</h3>
            <p className="text-sm text-muted-foreground">
              Personal notes and reflections can be read back to the user, helping with review and memorization.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
