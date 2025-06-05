import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Book, Users, Target, Mail, Github, Twitter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { SEOHead } from "@/components/seo-head"

export default function AboutPage() {
  const teamValues = [
    {
      icon: <Heart className="h-8 w-8 text-amber-600" />,
      title: "Faith-Centered",
      description: "Everything we build is rooted in biblical truth and designed to honor God and serve His people.",
    },
    {
      icon: <Book className="h-8 w-8 text-amber-600" />,
      title: "Scripture-Focused",
      description:
        "We believe the Bible is God's Word and our technology should make it more accessible, not replace it.",
    },
    {
      icon: <Users className="h-8 w-8 text-amber-600" />,
      title: "Community-Driven",
      description: "We're building for the global body of Christ, listening to feedback and serving diverse needs.",
    },
    {
      icon: <Target className="h-8 w-8 text-amber-600" />,
      title: "Excellence-Minded",
      description: "We strive for excellence in everything we do, believing our work is worship unto the Lord.",
    },
  ]

  return (
    <>
      <SEOHead
        title="About BibleAF – Our Mission & Team"
        description="Learn about BibleAF's mission to make Bible study more accessible through AI technology. Meet our team and discover our faith-centered approach to biblical technology."
        canonical="/about"
      />

      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              About BibleAF
            </h1>
            <p className="text-xl text-muted-foreground">
              Bridging ancient wisdom with modern technology for the glory of God
            </p>
          </div>

          {/* Mission Statement */}
          <Card className="divine-light-card mb-16">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                BibleAF exists to make the timeless wisdom of Scripture more accessible to modern believers through
                thoughtful application of artificial intelligence. We believe that technology, when used wisely, can
                enhance our understanding of God's Word without replacing the essential work of the Holy Spirit in our
                hearts.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Our goal is not to replace traditional Bible study, pastors, or spiritual mentors, but to provide tools
                that help believers dive deeper into Scripture, find relevant passages for their life situations, and
                grow in their relationship with Jesus Christ.
              </p>
            </CardContent>
          </Card>

          {/* Our Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {teamValues.map((value, index) => (
                <Card key={index} className="divine-light-card hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {value.icon}
                      <h3 className="text-xl font-semibold ml-3">{value.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Our Story */}
          <Card className="divine-light-card mb-16">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    BibleAF was born from a simple observation: while we have incredible technology at our fingertips,
                    many believers still struggle to find relevant biblical guidance for their daily challenges.
                  </p>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    Our team of Christian developers, theologians, and designers came together with a shared vision: to
                    create tools that help people discover the richness of Scripture in new and meaningful ways.
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    We're committed to building technology that serves the Church, honors biblical truth, and ultimately
                    points people to Jesus Christ.
                  </p>
                </div>
                <div className="relative">
                  <Image
                    src="/images/ai-jesus-teaching-children.png"
                    alt="AI representation of Jesus teaching, symbolizing our mission to make biblical wisdom accessible"
                    width={400}
                    height={300}
                    className="rounded-lg shadow-lg"
                    loading="lazy"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theological Approach */}
          <Card className="divine-light-card mb-16">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Theological Approach</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="leading-relaxed">
                  <strong>Scripture Authority:</strong> We believe the Bible is the inspired, inerrant Word of God and
                  the final authority for faith and practice. Our AI tools are designed to help you study Scripture, not
                  replace it.
                </p>
                <p className="leading-relaxed">
                  <strong>Denominational Neutrality:</strong> While our team comes from various Christian backgrounds,
                  we strive to focus on core biblical truths that unite believers across denominational lines.
                </p>
                <p className="leading-relaxed">
                  <strong>Holy Spirit Dependence:</strong> We recognize that true spiritual understanding comes from the
                  Holy Spirit. Our technology is a tool to assist study, but spiritual discernment and growth come from
                  God alone.
                </p>
                <p className="leading-relaxed">
                  <strong>Community Emphasis:</strong> We encourage users to verify AI insights with trusted pastors,
                  mentors, and the broader Christian community. Technology should enhance, not replace, biblical
                  community.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="divine-light-card">
            <CardContent className="p-8 text-center">
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <p className="text-muted-foreground mb-8">
                We'd love to hear from you! Whether you have questions, feedback, or just want to share how BibleAF has
                impacted your spiritual journey, we're here to listen.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button asChild className="divine-button">
                  <Link href="/contact">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Us
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="mailto:hello@bibleaf.ai">
                    <Mail className="h-4 w-4 mr-2" />
                    hello@bibleaf.ai
                  </Link>
                </Button>
              </div>

              <div className="flex justify-center space-x-6 text-muted-foreground">
                <Link href="https://github.com/bibleaf" className="hover:text-amber-600 transition-colors">
                  <Github className="h-6 w-6" />
                  <span className="sr-only">GitHub</span>
                </Link>
                <Link href="https://twitter.com/bibleaf" className="hover:text-amber-600 transition-colors">
                  <Twitter className="h-6 w-6" />
                  <span className="sr-only">Twitter</span>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
