import { checkSubscription } from "@/lib/subscription"

import { Tools } from "@/components/tools"
import { Heading } from "@/components/ui/heading"
import { UserButton } from "@clerk/nextjs"
import { MAX_FREE_COUNTS } from "@/constants"
import { getApiLimitCount } from "@/lib/api-limit"
import { DecrementButton } from "@/components/decrement-button"
import { IncrementButton } from "@/components/increment-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Confetti } from "@/components/confetti"
import { ModeToggle } from "@/components/mode-toggle"
import { BibleVerse } from "@/components/bible-verse"
import ComprehensiveBibleSearch from "@/components/comprehensive-bible-search"

const DashboardPage = async () => {
  const apiLimitCount = await getApiLimitCount()
  const isPro = await checkSubscription()

  return (
    <div>
      <Confetti />
      <div className="mb-8 space-y-4">
        <Heading title="Dashboard" description="Manage your account and AI Tools" />
        <div className="flex items-center gap-x-4">
          <IncrementButton />
          <DecrementButton />
          <ModeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
      <Card className="w-[200px]">
        <CardHeader>
          <CardTitle>Credits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {apiLimitCount} / {MAX_FREE_COUNTS}
          </div>
        </CardContent>
      </Card>
      <Badge variant="secondary" className="w-fit">
        {isPro ? "Pro" : "Free"}
      </Badge>
      <BibleVerse />

      {/* Comprehensive Bible Search */}
      <section className="mb-12">
        <ComprehensiveBibleSearch />
      </section>

      <Tools isPro={isPro} />
    </div>
  )
}

export default DashboardPage
