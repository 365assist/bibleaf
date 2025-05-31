"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { AuthService } from "@/lib/auth"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const result = await AuthService.login(formData.email, formData.password)

    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "Login failed")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/images/divine-light-background.png')] bg-cover bg-center bg-fixed opacity-10"></div>

      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Hero Image and Branding */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 font-bold text-4xl mb-4">
                <span className="text-amber-600">Bible</span>
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-lg shadow-lg">
                  AF
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                Where Tradition Meets Innovation
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Experience the Bible like never before with AI-powered insights
              </p>
            </div>

            {/* Hero Image */}
            <div className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl blur-2xl opacity-20"></div>
              <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 shadow-2xl border border-amber-200 dark:border-amber-800">
                <Image
                  src="/images/ai-bible-robot.png"
                  alt="AI-powered Bible study"
                  width={400}
                  height={400}
                  className="w-full h-auto rounded-xl"
                  priority
                />
              </div>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <div className="text-amber-600 font-semibold text-sm">AI Search</div>
                <div className="text-gray-600 dark:text-gray-400 text-xs">Find verses instantly</div>
              </div>
              <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                <div className="text-amber-600 font-semibold text-sm">Life Guidance</div>
                <div className="text-gray-600 dark:text-gray-400 text-xs">Personalized insights</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="text-center lg:hidden mb-8">
              <div className="flex items-center justify-center gap-2 font-bold text-2xl mb-2">
                <span className="text-amber-600">Bible</span>
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-1 rounded">AF</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Welcome back</h2>
              <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
            </div>

            <div className="hidden lg:block text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Welcome back</h2>
              <p className="text-gray-600 dark:text-gray-400">Sign in to continue your spiritual journey</p>
            </div>

            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-amber-200 dark:border-amber-800 rounded-2xl p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-amber-200 dark:border-amber-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-3 pr-12 border border-amber-200 dark:border-amber-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm border border-red-200 dark:border-red-800">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 font-medium shadow-lg transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>

              <div className="mt-8 space-y-4">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-amber-200 dark:border-amber-800"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white/80 dark:bg-gray-900/80 text-gray-500 dark:text-gray-400">
                      Developer Access
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ email: "dev@bibleaf.com", password: "dev2024!" })}
                    className="text-left p-4 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 text-sm transition-colors"
                  >
                    <div className="font-medium text-gray-800 dark:text-gray-200">Developer Account</div>
                    <div className="text-gray-500 dark:text-gray-400">dev@bibleaf.com / dev2024!</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ email: "admin@bibleaf.com", password: "admin2024!" })}
                    className="text-left p-4 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 text-sm transition-colors"
                  >
                    <div className="font-medium text-gray-800 dark:text-gray-200">Admin Account</div>
                    <div className="text-gray-500 dark:text-gray-400">admin@bibleaf.com / admin2024!</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ email: "test@bibleaf.com", password: "test2024!" })}
                    className="text-left p-4 border border-amber-200 dark:border-amber-800 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 text-sm transition-colors"
                  >
                    <div className="font-medium text-gray-800 dark:text-gray-200">Test Account</div>
                    <div className="text-gray-500 dark:text-gray-400">test@bibleaf.com / test2024!</div>
                  </button>
                </div>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link href="/auth/signup" className="text-amber-600 hover:text-amber-700 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
