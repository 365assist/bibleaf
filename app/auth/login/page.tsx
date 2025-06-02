"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2, ArrowLeft, BookOpen, Moon, Sun } from "lucide-react"
import { AuthService } from "@/lib/auth"
import { useTheme } from "next-themes"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
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

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors">
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Home</span>
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 font-bold text-xl">
              <BookOpen className="text-amber-600" size={24} />
              <span className="text-amber-600">Bible</span>
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-lg shadow-lg text-sm">
                AF
              </span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg border border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-amber-600" />
              ) : (
                <Moon className="h-4 w-4 text-amber-600" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="relative min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Hero Content */}
          <div className="hidden lg:flex flex-col items-center justify-center space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Welcome Back to Your
                <span className="block text-amber-600">Spiritual Journey</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md">
                Continue exploring God's word with AI-powered insights, personalized guidance, and daily inspiration.
              </p>
            </div>

            {/* Hero Image */}
            <div className="relative w-full max-w-lg">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-amber-200 dark:border-amber-800">
                <Image
                  src="/images/ai-bible-robot.png"
                  alt="AI-powered Bible study companion"
                  width={500}
                  height={500}
                  className="w-full h-auto rounded-2xl"
                  priority
                />
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 border border-amber-200 dark:border-amber-800 shadow-lg">
                <div className="text-amber-600 font-semibold mb-1">Smart Search</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Find verses by meaning, not just words</div>
              </div>
              <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 border border-amber-200 dark:border-amber-800 shadow-lg">
                <div className="text-amber-600 font-semibold mb-1">Daily Wisdom</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Personalized verses for your journey</div>
              </div>
              <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 border border-amber-200 dark:border-amber-800 shadow-lg">
                <div className="text-amber-600 font-semibold mb-1">Life Guidance</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">AI-powered spiritual insights</div>
              </div>
              <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-sm rounded-xl p-4 border border-amber-200 dark:border-amber-800 shadow-lg">
                <div className="text-amber-600 font-semibold mb-1">Audio Bible</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">Listen to scripture anywhere</div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-full max-w-md mx-auto">
            {/* Mobile Header */}
            <div className="text-center lg:hidden mb-8">
              <div className="flex items-center justify-center gap-2 font-bold text-2xl mb-4">
                <BookOpen className="text-amber-600" size={28} />
                <span className="text-amber-600">Bible</span>
                <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-lg">
                  AF
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Welcome Back</h2>
              <p className="text-gray-600 dark:text-gray-400">Sign in to continue your spiritual journey</p>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">Sign In</h2>
              <p className="text-gray-600 dark:text-gray-400">Enter your credentials to access your account</p>
            </div>

            {/* Login Form Card */}
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-amber-200 dark:border-amber-800 rounded-3xl p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-4 border border-amber-200 dark:border-amber-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm transition-all duration-200 text-gray-900 dark:text-gray-100"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-4 py-4 pr-12 border border-amber-200 dark:border-amber-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm transition-all duration-200 text-gray-900 dark:text-gray-100"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-2">
                    <Link
                      href="/auth/forgot-password"
                      className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm border border-red-200 dark:border-red-800">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 font-semibold shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Signing in...
                    </>
                  ) : (
                    "Sign In to BibleAF"
                  )}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/signup"
                    className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                  >
                    Create your free account
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
