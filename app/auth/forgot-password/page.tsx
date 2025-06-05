"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, BookOpen, Mail, Loader2, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
      } else {
        setError(data.error || "Failed to send reset email")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    }

    setIsLoading(false)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950">
        <div className="absolute inset-0 bg-[url('/images/divine-light-background.png')] bg-cover bg-center bg-fixed opacity-10"></div>

        {/* Header */}
        <div className="relative z-10 p-6">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <Link
              href="/auth/login"
              className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors"
            >
              <ArrowLeft size={20} />
              <span className="font-medium">Back to Login</span>
            </Link>

            <div className="flex items-center gap-2 font-bold text-xl">
              <BookOpen className="text-amber-600" size={24} />
              <span className="text-amber-600">Bible</span>
              <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-lg shadow-lg text-sm">
                AF
              </span>
            </div>
          </div>
        </div>

        <div className="relative min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-amber-200 dark:border-amber-800 rounded-3xl p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
              </div>

              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Check Your Email</h1>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We've sent a password reset link to <strong className="text-amber-600">{email}</strong>
              </p>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-6 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Didn't receive the email?</strong> Check your spam folder or try again in a few minutes.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setIsSuccess(false)
                    setEmail("")
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 font-semibold shadow-lg transition-all duration-200"
                >
                  Send Another Email
                </button>

                <Link
                  href="/auth/login"
                  className="block w-full px-6 py-3 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 font-semibold transition-all duration-200 text-center"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950">
      <div className="absolute inset-0 bg-[url('/images/divine-light-background.png')] bg-cover bg-center bg-fixed opacity-10"></div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link
            href="/auth/login"
            className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Login</span>
          </Link>

          <div className="flex items-center gap-2 font-bold text-xl">
            <BookOpen className="text-amber-600" size={24} />
            <span className="text-amber-600">Bible</span>
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-lg shadow-lg text-sm">
              AF
            </span>
          </div>
        </div>
      </div>

      <div className="relative min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
        <div className="w-full max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="text-amber-600" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">Forgot Password?</h1>
            <p className="text-gray-600 dark:text-gray-400">
              No worries! Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-4 border border-amber-200 dark:border-amber-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm transition-all duration-200 text-gray-900 dark:text-gray-100"
                  placeholder="Enter your email address"
                />
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
                    Sending Reset Link...
                  </>
                ) : (
                  <>
                    <Mail size={18} />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Remember your password?{" "}
                <Link
                  href="/auth/login"
                  className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
