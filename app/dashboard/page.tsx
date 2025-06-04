import BibleNavigation from "@/components/bible-navigation"

export default function DashboardPage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Existing components */}

      {/* Add Bible Navigation */}
      <div className="md:col-span-2 lg:col-span-3">
        <BibleNavigation />
      </div>
    </div>
  )
}
