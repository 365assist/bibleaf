// Disable static generation for dashboard page
export const dynamic = 'force-dynamic'

// Skip static prerendering entirely
export const generateStaticParams = () => {
  return []
}

// Force client-side rendering only
export default function DashboardPage() {
  if (typeof window === 'undefined') {
    // Server-side: render minimal placeholder
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Loading Dashboard...</h1>
          <p>Please wait while we prepare your Bible dashboard</p>
        </div>
      </div>
    )
  }

  // Client-side: dynamically import the real component
  const ClientDashboardPage = require('./client-page').default
  return <ClientDashboardPage />
}
