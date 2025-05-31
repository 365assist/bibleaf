import { CreditCard } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="mb-4">
        <a
          href="/stripe-test"
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          rel="noreferrer"
        >
          <CreditCard size={16} />
          Test Stripe Integration
        </a>
      </div>

      <p>Welcome to your dashboard!</p>
    </div>
  )
}
