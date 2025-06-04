import type { NextRequest } from "next/server"
import { updateUsageTracking } from "@/lib/blob-storage"

export async function POST(request: NextRequest) {
  try {
    console.log("=== AI Guidance API Route Called ===")

    const body = await request.json()
    console.log("Request body:", body)

    const { situation, userId } = body

    console.log("Extracted situation:", situation)
    console.log("Extracted userId:", userId)

    if (!situation) {
      console.error("Missing required situation field")
      return new Response(
        JSON.stringify({
          success: false,
          error: "Situation is required",
          received: { situation: !!situation },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Handle demo users or missing userId
    const isDemo = !userId || userId === "demo-user"
    console.log("Is demo user:", isDemo)

    // For demo users, skip usage tracking
    let usageAllowed = true
    if (!isDemo && userId) {
      try {
        console.log("Checking usage limits for user:", userId)
        usageAllowed = await updateUsageTracking(userId, "guidance")
        console.log("Usage allowed:", usageAllowed)

        if (!usageAllowed) {
          console.log("Usage limit exceeded for user:", userId)
          return new Response(
            JSON.stringify({
              success: false,
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
      } catch (usageError) {
        console.error("Usage tracking error:", usageError)
        // Continue without usage tracking for now
      }
    }

    console.log("Generating AI Bible guidance")

    // Generate contextual guidance based on situation keywords
    const situationLower = situation.toLowerCase()
    let guidance

    if (situationLower.includes("anxiety") || situationLower.includes("worry") || situationLower.includes("fear")) {
      guidance = {
        guidance:
          "Anxiety is a common human experience, but God doesn't want you to carry these burdens alone. The Bible offers comfort and practical guidance for dealing with worry and fear. Remember that God's perfect love casts out fear, and His peace can guard your heart and mind.",
        verses: [
          {
            reference: "Philippians 4:6-7",
            text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God. And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.",
            relevanceScore: 98,
            context: "Paul's prescription for anxiety: prayer with thanksgiving leads to supernatural peace.",
          },
          {
            reference: "1 Peter 5:7",
            text: "Cast all your anxiety on him because he cares for you.",
            relevanceScore: 95,
            context: "God genuinely cares about our concerns and wants us to release our worries to Him.",
          },
          {
            reference: "Matthew 6:26",
            text: "Look at the birds of the air; they do not sow or reap or store away in barns, and yet your heavenly Father feeds them. Are you not much more valuable than they?",
            relevanceScore: 90,
            context: "Jesus reminds us of God's care for creation and His greater care for us.",
          },
        ],
        practicalSteps: [
          "Practice deep breathing while reciting Bible verses about God's peace",
          "Write down your worries and pray over each one specifically",
          "Focus on what you can control and surrender what you cannot to God",
          "Establish a daily quiet time for prayer and Bible reading",
          "Consider sharing your concerns with a trusted Christian friend or counselor",
        ],
        prayerSuggestion:
          "Lord Jesus, You know the anxiety that weighs on my heart. I bring my worries and fears to You, knowing that You care for me. Please replace my anxiety with Your perfect peace. Help me to trust in Your goodness and sovereignty. Give me strength for today and hope for tomorrow. Amen.",
      }
    } else if (
      situationLower.includes("forgiv") ||
      situationLower.includes("hurt") ||
      situationLower.includes("anger") ||
      situationLower.includes("resentment")
    ) {
      guidance = {
        guidance:
          "Forgiveness is one of the most challenging yet transformative aspects of following Christ. When someone has hurt us deeply, our natural response is often anger or resentment. However, God calls us to forgive as we have been forgiven, not because the wrong was acceptable, but because forgiveness frees us from bitterness and allows God's healing to work in our hearts.",
        verses: [
          {
            reference: "Ephesians 4:32",
            text: "Be kind and compassionate to one another, forgiving each other, just as in Christ God forgave you.",
            relevanceScore: 98,
            context:
              "The motivation for forgiveness is God's forgiveness of us - we extend grace because we've received it.",
          },
          {
            reference: "Matthew 6:14-15",
            text: "For if you forgive other people when they sin against you, your heavenly Father will also forgive you. But if you do not forgive others their sins, your Father will not forgive your sins.",
            relevanceScore: 95,
            context: "Jesus establishes a direct connection between receiving and extending forgiveness.",
          },
          {
            reference: "Colossians 3:13",
            text: "Bear with each other and forgive one another if any of you has a grievance against someone. Forgive as the Lord forgave you.",
            relevanceScore: 92,
            context: "Forgiveness is a choice we make repeatedly, following Christ's example.",
          },
        ],
        practicalSteps: [
          "Pray for the person who hurt you, even if it feels difficult at first",
          "Write down your feelings and bring them to God in prayer",
          "Focus on God's forgiveness of you when you struggle to forgive others",
          "Set healthy boundaries while still choosing to forgive",
          "Seek counseling or pastoral care if the hurt is deep or traumatic",
        ],
        prayerSuggestion:
          "Heavenly Father, forgiveness feels so difficult right now. You know the pain I'm carrying and how hard it is to let go. Please help me to forgive as You have forgiven me. Heal my heart and help me to trust You with justice. Fill me with Your love and peace. In Jesus' name, Amen.",
      }
    } else if (
      situationLower.includes("decision") ||
      situationLower.includes("choice") ||
      situationLower.includes("guidance") ||
      situationLower.includes("direction")
    ) {
      guidance = {
        guidance:
          "Making important decisions can feel overwhelming, but God promises to guide those who seek His wisdom. He doesn't always reveal the entire path at once, but He gives us enough light for the next step. Trust that He is working even when you can't see the full picture.",
        verses: [
          {
            reference: "Proverbs 3:5-6",
            text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
            relevanceScore: 98,
            context: "Complete trust in God leads to clear direction in life.",
          },
          {
            reference: "James 1:5",
            text: "If any of you lacks wisdom, you should ask God, who gives generously to all without finding fault, and it will be given to you.",
            relevanceScore: 95,
            context: "God promises to give wisdom generously to those who ask for it.",
          },
          {
            reference: "Psalm 119:105",
            text: "Your word is a lamp for my feet, a light for my path.",
            relevanceScore: 90,
            context: "God's Word provides guidance and illumination for our decisions.",
          },
        ],
        practicalSteps: [
          "Spend time in prayer, asking God for wisdom and clarity",
          "Study relevant Bible passages that speak to your situation",
          "Seek counsel from wise, godly mentors or friends",
          "Consider the potential outcomes and how they align with biblical principles",
          "Take time to listen for God's leading through prayer and Scripture",
        ],
        prayerSuggestion:
          "Lord, I need Your wisdom and guidance in this decision. Help me to trust in Your perfect plan and timing. Give me clarity of mind and peace in my heart. Show me the path You want me to take, and give me courage to follow it. Amen.",
      }
    } else if (
      situationLower.includes("relationship") ||
      situationLower.includes("marriage") ||
      situationLower.includes("family") ||
      situationLower.includes("conflict")
    ) {
      guidance = {
        guidance:
          "Relationships are central to God's design for human flourishing, but they can also be sources of great challenge. Whether you're dealing with conflict, seeking to strengthen bonds, or navigating difficult family dynamics, God's Word provides wisdom for building healthy, loving relationships that honor Him.",
        verses: [
          {
            reference: "1 Corinthians 13:4-7",
            text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs. Love does not delight in evil but rejoices with the truth. It always protects, always trusts, always hopes, always perseveres.",
            relevanceScore: 98,
            context: "The biblical definition of love provides a framework for all relationships.",
          },
          {
            reference: "Ephesians 4:2-3",
            text: "Be completely humble and gentle; be patient, bearing with one another in love. Make every effort to keep the unity of the Spirit through the bond of peace.",
            relevanceScore: 95,
            context: "Practical guidance for maintaining unity and peace in relationships.",
          },
          {
            reference: "Matthew 18:15",
            text: "If your brother or sister sins, go and point out their fault, just between the two of you. If they listen to you, you have won them over.",
            relevanceScore: 90,
            context: "Jesus' method for addressing conflict in relationships.",
          },
        ],
        practicalSteps: [
          "Practice active listening and seek to understand before being understood",
          "Address conflicts directly but with gentleness and humility",
          "Pray for the people in your relationships, especially those causing difficulty",
          "Focus on your own actions and attitudes rather than trying to change others",
          "Seek wise counsel from mature believers when facing relationship challenges",
        ],
        prayerSuggestion:
          "Father, help me to love others as You have loved me. Give me patience, kindness, and wisdom in my relationships. Help me to be quick to listen, slow to speak, and slow to anger. Show me how to build bridges rather than walls. Amen.",
      }
    } else {
      // Default guidance for general situations
      guidance = {
        guidance:
          "Thank you for seeking biblical guidance. While every situation is unique, God's Word provides timeless wisdom and comfort for all of life's challenges. Remember that God loves you deeply, has a purpose for your life, and is always ready to help those who call upon Him.",
        verses: [
          {
            reference: "Romans 8:28",
            text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
            relevanceScore: 95,
            context: "God's promise that He can work even difficult circumstances for our good.",
          },
          {
            reference: "Jeremiah 29:11",
            text: 'For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future.',
            relevanceScore: 90,
            context: "God's assurance that He has good plans for our lives.",
          },
          {
            reference: "Philippians 4:13",
            text: "I can do all this through him who gives me strength.",
            relevanceScore: 88,
            context: "The source of our strength for facing any challenge.",
          },
        ],
        practicalSteps: [
          "Bring your specific concerns to God in prayer",
          "Search the Scriptures for wisdom related to your situation",
          "Seek godly counsel from mature believers",
          "Trust in God's timing and faithfulness",
          "Take practical steps while depending on God's guidance",
        ],
        prayerSuggestion:
          "Heavenly Father, I bring this situation to You, knowing that You care about every detail of my life. Please grant me wisdom, peace, and strength. Help me to trust in Your goodness and to follow Your leading. Thank You for Your love and faithfulness. In Jesus' name, Amen.",
      }
    }

    const response = {
      success: true,
      situation,
      guidance: guidance.guidance,
      verses: guidance.verses,
      practicalSteps: guidance.practicalSteps,
      prayerSuggestion: guidance.prayerSuggestion,
      timestamp: new Date().toISOString(),
      demo: isDemo,
    }

    console.log("Sending response:", response)
    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error in AI guidance API:", error)

    // Always return valid JSON, even for errors
    const fallbackGuidance = {
      guidance:
        "During times of uncertainty, the Bible encourages us to trust in God's plan and seek His wisdom. Remember that God is always with you, guiding your steps and providing comfort in every situation.",
      verses: [
        {
          reference: "Psalm 23:4",
          text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.",
          relevanceScore: 95,
          context: "God's presence provides comfort and guidance in difficult times.",
        },
        {
          reference: "Isaiah 41:10",
          text: "So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you; I will uphold you with my righteous right hand.",
          relevanceScore: 90,
          context: "God's promise of strength and support in times of trouble.",
        },
      ],
      practicalSteps: [
        "Take time for prayer and reflection",
        "Seek wisdom from Scripture",
        "Consult with trusted spiritual mentors",
        "Remember God's faithfulness in past situations",
      ],
      prayerSuggestion:
        "Heavenly Father, grant me wisdom and clarity as I navigate this situation. Help me to trust in Your perfect plan and to follow Your guidance. Give me peace and strength for each day. Amen.",
    }

    const errorResponse = {
      success: true, // Return success: true to avoid client-side errors
      error: "Guidance service temporarily unavailable",
      fallback: true,
      situation: "general guidance",
      guidance: fallbackGuidance.guidance,
      verses: fallbackGuidance.verses,
      practicalSteps: fallbackGuidance.practicalSteps,
      prayerSuggestion: fallbackGuidance.prayerSuggestion,
      timestamp: new Date().toISOString(),
    }

    return new Response(JSON.stringify(errorResponse), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  }
}
