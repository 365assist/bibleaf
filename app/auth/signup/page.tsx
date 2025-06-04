"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2, Sparkles } from "lucide-react"
import { AuthService } from "@/lib/auth"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    const result = await AuthService.signup(formData.email, formData.password, formData.name)

    if (result.success) {
      router.push("/dashboard")
    } else {
      setError(result.error || "Signup failed")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4">
      {/* Divine Sunset Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/divine-sunset-mountains.png')",
        }}
      />

      {/* Gradient Overlay for Better Readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-orange-900/40" />

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]" />

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 font-bold text-3xl mb-4">
            <Sparkles className="text-yellow-300 animate-pulse" size={28} />
            <span className="text-white drop-shadow-lg">Bible</span>
            <span className="bg-gradient-to-r from-yellow-300 to-orange-300 text-purple-900 px-2 py-1 rounded-lg shadow-lg font-black">
              AF
            </span>
            <Sparkles className="text-yellow-300 animate-pulse" size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white drop-shadow-lg">Begin Your Spiritual Journey</h2>
            <p className="text-blue-100 drop-shadow-md text-lg">Join thousands discovering God's wisdom through AI</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2 text-white drop-shadow-sm">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2 text-white drop-shadow-sm">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-2 text-white drop-shadow-sm">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 pr-12 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
                  placeholder="Create a secure password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2 text-white drop-shadow-sm">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-3 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-300 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
                placeholder="Confirm your password"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 backdrop-blur-sm text-red-100 rounded-xl text-sm border border-red-400/30">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 text-purple-900 rounded-xl hover:from-yellow-300 hover:to-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating Your Account...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Create My Account
                </>
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-8 text-center">
            <p className="text-blue-100 drop-shadow-sm">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-yellow-300 hover:text-yellow-200 font-semibold transition-colors underline decoration-2 underline-offset-2"
              >
                Sign In Here
              </Link>
            </p>
          </div>
        </div>

        {/* Terms and Privacy */}
        <div className="text-center">
          <p className="text-xs text-blue-200/80 drop-shadow-sm leading-relaxed">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-yellow-300 hover:text-yellow-200 underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-yellow-300 hover:text-yellow-200 underline">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Inspirational Quote */}
        <div className="text-center mt-8">
          <blockquote className="text-blue-100/90 italic text-sm drop-shadow-sm">
            "For I know the plans I have for you," declares the LORD,
            <br />
            "plans to prosper you and not to harm you,
            <br />
            to give you hope and a future."
            <footer className="text-yellow-300 font-semibold mt-2">— Jeremiah 29:11</footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
