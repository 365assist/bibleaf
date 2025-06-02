"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BookOpen, Eye, EyeOff, Loader2, CheckCircle, AlertCircle } from "lucide-react"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)

  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.")
      setTokenValid(false)
      return
    }

    // Validate token
    const validateToken = async () => {
      try {
        const response = await fetch("/api/auth/validate-reset-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        if (response.ok) {
          setTokenValid(true)
        } else {
          setTokenValid(false)
          setError("This reset link has expired or is invalid. Please request a new one.")
        }
      } catch (error) {
        setTokenValid(false)
        setError("Unable to validate reset link. Please try again.")
      }
    }

    validateToken()
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
      } else {
        setError(data.error || "Failed to reset password")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    }

    setIsLoading(false)
  }

  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-amber-600 mx-auto mb-4" size={32} />
          <p className="text-gray-600 dark:text-gray-400">Validating reset link...</p>
        </div>
      </div>
    )
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950">
        <div className="absolute inset-0 bg-[url('/images/divine-light-background.png')] bg-cover bg-center bg-fixed opacity-10"></div>

        <div className="relative z-10 p-6">
          <div className="flex items-center justify-center">
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
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-red-200 dark:border-red-800 rounded-3xl p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="text-red-600 dark:text-red-400" size={32} />
              </div>

              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Invalid Reset Link</h1>

              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>

              <div className="space-y-3">
                <Link
                  href="/auth/forgot-password"
                  className="block w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 font-semibold shadow-lg transition-all duration-200 text-center"
                >
                  Request New Reset Link
                </Link>

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

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950">
        <div className="absolute inset-0 bg-[url('/images/divine-light-background.png')] bg-cover bg-center bg-fixed opacity-10"></div>

        <div className="relative z-10 p-6">
          <div className="flex items-center justify-center">
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
            <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-green-200 dark:border-green-800 rounded-3xl p-8 shadow-2xl text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-green-600 dark:text-green-400" size={32} />
              </div>

              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Password Reset Successful!</h1>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your password has been successfully updated. You will be redirected to the login page in a few seconds.
              </p>

              <Link
                href="/auth/login"
                className="block w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 font-semibold shadow-lg transition-all duration-200 text-center"
              >
                Continue to Login
              </Link>
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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">Reset Your Password</h1>
            <p className="text-gray-600 dark:text-gray-400">Enter your new password below</p>
          </div>

          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border border-amber-200 dark:border-amber-800 rounded-3xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-4 pr-12 border border-amber-200 dark:border-amber-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm transition-all duration-200 text-gray-900 dark:text-gray-100"
                    placeholder="Enter new password"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300"
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-4 pr-12 border border-amber-200 dark:border-amber-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm transition-all duration-200 text-gray-900 dark:text-gray-100"
                    placeholder="Confirm new password"
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-amber-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Password Requirements:</strong>
                  <br />• At least 8 characters long
                  <br />• Include a mix of letters and numbers
                </p>
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
                    Updating Password...
                  </>
                ) : (
                  "Update Password"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin text-amber-600 mx-auto mb-4" size={32} />
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  )
}
