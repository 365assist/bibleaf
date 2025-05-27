"use client"

import { AuthService } from '@/lib/client-auth'

interface AuthLoginComponentProps {
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (password: string) => void
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
  error: string
  setError: (error: string) => void
}

export function AuthLoginComponent({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  setIsLoading,
  error,
  setError
}: AuthLoginComponentProps) {
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // In a real app, this would call an API
      await AuthService.login(email, password)
      window.location.href = "/dashboard"
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setIsLoading(true)
    
    try {
      // In a real app, this would call an API
      await AuthService.login(demoEmail, demoPassword)
      window.location.href = "/dashboard"
    } catch (err) {
      setError("Demo login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 scripture-button"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Demo Accounts
            </span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <button
            onClick={() => handleDemoLogin("demo@bibleaf.com", "demo123")}
            className="w-full border py-2 rounded-md hover:bg-muted text-sm"
          >
            Free User Demo<br/>
            <span className="text-xs text-muted-foreground">demo@bibleaf.com / demo123</span>
          </button>
          
          <button
            onClick={() => handleDemoLogin("premium@bibleaf.com", "premium123")}
            className="w-full border py-2 rounded-md hover:bg-muted text-sm"
          >
            Premium User Demo<br/>
            <span className="text-xs text-muted-foreground">premium@bibleaf.com / premium123</span>
          </button>
        </div>
      </div>
    </>
  )
}
