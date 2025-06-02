import type { NextRequest } from "next/server"
import { aiService } from "@/lib/ai-service"
import { updateUsageTracking } from "@/lib/blob-storage"

export async function POST(request: NextRequest) {
  try {
    console.log("=== AI Guidance API Route Called ===")

    const body = await request.json()
    console.log("Request body:", body)

    const { situation, userId } = body

    console.log("Extracted situation:", situation)
    console.log("Extracted userId:", userId)

    if (!situation || !userId) {
      console.error("Missing required fields:", { situation: !!situation, userId: !!userId })
      return new Response(
        JSON.stringify({
          error: "Situation and user ID are required",
          received: { situation: !!situation, userId: !!userId },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    console.log("Checking usage limits for user:", userId)

    // Check usage limits
    const usageAllowed = await updateUsageTracking(userId, "guidance")
    console.log("Usage allowed:", usageAllowed)

    if (!usageAllowed) {
      console.log("Usage limit exceeded for user:", userId)
      return new Response(
        JSON.stringify({
          error: "Daily guidance limit exceeded",
          limitExceeded: true,
          message: "You've reached your daily guidance limit. Upgrade your plan for unlimited guidance.",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    console.log("Getting AI life guidance")

    // Get AI guidance
    const guidanceResult = await aiService.getLifeGuidance(situation)
    console.log("AI guidance result:", guidanceResult)

    const response = {
      success: true,
      situation,
      guidance: guidanceResult.guidance,
      verses: guidanceResult.relevantVerses || [],
      practicalSteps: guidanceResult.practicalSteps || [],
      prayerSuggestion: guidanceResult.prayerSuggestion,
      timestamp: new Date().toISOString(),
    }

    console.log("Sending response:", response)
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error in AI guidance API:", error)

    // Always return valid JSON with fallback guidance
    const situationLower = (request.body as any)?.situation?.toLowerCase() || ""

    let fallbackGuidance = {
      guidance:
        "Thank you for seeking biblical guidance. While our AI service is temporarily unavailable, remember that God's Word is always available to guide and comfort you. Take time to pray and seek God's wisdom through Scripture.",
      relevantVerses: [
        {
          reference: "James 1:5",
          text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
          relevanceScore: 0.95,
          context: "God promises to provide wisdom generously to those who ask in faith.",
        },
        {
          reference: "Psalm 119:105",
          text: "Your word is a lamp for my feet, a light for my path.",
          relevanceScore: 0.9,
          context: "God's Word provides guidance and direction for our daily decisions.",
        },
      ],
      practicalSteps: [
        "Spend time in prayer, bringing your specific situation to God",
        "Read relevant Bible passages that speak to your circumstances",
        "Seek wise counsel from trusted Christian friends or mentors",
        "Trust in God's timing and faithfulness as you wait for clarity",
      ],
      prayerSuggestion:
        "Dear Heavenly Father, I bring this situation to You, knowing that You care about every detail of my life. Please grant me wisdom and peace. Help me to trust in Your perfect plan and timing. Guide my steps and help me to honor You in all I do. In Jesus' name, Amen.",
    }

    // Customize based on situation keywords
    if (situationLower.includes("anxiety") || situationLower.includes("worry") || situationLower.includes("fear")) {
      fallbackGuidance = {
        guidance:
          "Anxiety is a common human experience, but God doesn't want you to carry these burdens alone. The Bible offers comfort and practical guidance for dealing with worry and fear. Remember that God's perfect love casts out fear, and His peace can guard your heart and mind.",
        relevantVerses: [
          {
            reference: "Philippians 4:6-7",
            text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
            relevanceScore: 0.98,
            context: "Paul's prescription for anxiety: prayer with thanksgiving leads to supernatural peace.",
          },
          {
            reference: "1 Peter 5:7",
            text: "Cast all your anxiety on him because he cares for you.",
            relevanceScore: 0.95,
            context: "God genuinely cares about our concerns and wants us to release our worries to Him.",
          },
        ],
        practicalSteps: [
          "Practice deep breathing while reciting Bible verses about God's peace",
          "Write down your worries and pray over each one specifically",
          "Focus on what you can control and surrender what you cannot to God",
          "Establish a daily quiet time for prayer and Bible reading",
        ],
        prayerSuggestion:
          "Lord Jesus, You know the anxiety that weighs on my heart. I bring my worries and fears to You, knowing that You care for me. Please replace my anxiety with Your perfect peace. Help me to trust in Your goodness and sovereignty. Give me strength for today and hope for tomorrow. Amen.",
      }
    } else if (
      situationLower.includes("forgiv") ||
      situationLower.includes("hurt") ||
      situationLower.includes("anger")
    ) {
      fallbackGuidance = {
        guidance:
          "Forgiveness is one of the most challenging yet transformative aspects of following Christ. When someone has hurt us deeply, our natural response is often anger or resentment. However, God calls us to forgive as we have been forgiven, not because the wrong was acceptable, but because forgiveness frees us from bitterness.",
        relevantVerses: [
          {
            reference: "Ephesians 4:32",
            text: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.",
            relevanceScore: 0.98,
            context:
              "The motivation for forgiveness is God's forgiveness of us - we extend grace because we've received it.",
          },
          {
            reference: "Matthew 6:14-15",
            text: "For if you forgive other people when they sin against you, your heavenly Father will also forgive you. But if you do not forgive others their sins, your Father will not forgive your sins.",
            relevanceScore: 0.95,
            context: "Jesus establishes a direct connection between receiving and extending forgiveness.",
          },
        ],
        practicalSteps: [
          "Pray for the person who hurt you, even if it feels difficult at first",
          "Write down your feelings and bring them to God in prayer",
          "Focus on God's forgiveness of you when you struggle to forgive others",
          "Set healthy boundaries while still choosing to forgive",
        ],
        prayerSuggestion:
          "Heavenly Father, forgiveness feels so difficult right now. You know the pain I'm carrying and how hard it is to let go. Please help me to forgive as You have forgiven me. Heal my heart and help me to trust You with justice. Fill me with Your love and peace. In Jesus' name, Amen.",
      }
    }

    const errorResponse = {
      success: false,
      error: "Guidance service temporarily unavailable",
      fallback: true,
      ...fallbackGuidance,
      timestamp: new Date().toISOString(),
    }

    return new Response(JSON.stringify(errorResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }
}
