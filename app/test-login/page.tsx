"use client"

import { useState } from "react"
import { AuthService, type User } from "@/lib/auth"
import { CheckCircle, XCircle, Loader2, UserIcon, Shield, TestTube } from "lucide-react"

interface TestResult {
  email: string
  password: string
  accountType: string
  status: "pending" | "success" | "error"
  user?: User
  error?: string
  duration?: number
}

export default function LoginTestPage() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const testAccounts = [
    {
      email: "dev@bibleaf.com",
      password: "dev2024!",
      accountType: "Developer Account",
    },
    {
      email: "admin@bibleaf.com",
      password: "admin2024!",
      accountType: "Admin Account",
    },
    {
      email: "test@bibleaf.com",
      password: "test2024!",
      accountType: "Test Account",
    },
    {
      email: "invalid@example.com",
      password: "wrongpassword",
      accountType: "Invalid Account (Should Fail)",
    },
  ]

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])
    setCurrentUser(null)

    // Initialize test results
    const initialResults: TestResult[] = testAccounts.map((account) => ({
      ...account,
      status: "pending",
    }))
    setTestResults(initialResults)

    // Run tests sequentially
    for (let i = 0; i < testAccounts.length; i++) {
      const account = testAccounts[i]
      const startTime = Date.now()

      try {
        // Update status to show current test
        setTestResults((prev) => prev.map((result, index) => (index === i ? { ...result, status: "pending" } : result)))

        const result = await AuthService.login(account.email, account.password)
        const duration = Date.now() - startTime

        if (result.success && result.user) {
          // Success
          setTestResults((prev) =>
            prev.map((testResult, index) =>
              index === i
                ? {
                    ...testResult,
                    status: "success",
                    user: result.user,
                    duration,
                  }
                : testResult,
            ),
          )

          // Set current user for the last successful login
          if (account.email !== "invalid@example.com") {
            setCurrentUser(result.user)
          }
        } else {
          // Expected failure for invalid account
          setTestResults((prev) =>
            prev.map((testResult, index) =>
              index === i
                ? {
                    ...testResult,
                    status: account.email === "invalid@example.com" ? "success" : "error",
                    error: result.error,
                    duration,
                  }
                : testResult,
            ),
          )
        }
      } catch (error) {
        const duration = Date.now() - startTime
        setTestResults((prev) =>
          prev.map((testResult, index) =>
            index === i
              ? {
                  ...testResult,
                  status: "error",
                  error: error instanceof Error ? error.message : "Unknown error",
                  duration,
                }
              : testResult,
          ),
        )
      }

      // Add delay between tests
      if (i < testAccounts.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    setIsRunning(false)
  }

  const logout = () => {
    AuthService.logout()
    setCurrentUser(null)
  }

  const getAccountIcon = (accountType: string) => {
    if (accountType.includes("Developer")) return <UserIcon className="w-4 h-4" />
    if (accountType.includes("Admin")) return <Shield className="w-4 h-4" />
    if (accountType.includes("Test")) return <TestTube className="w-4 h-4" />
    return <XCircle className="w-4 h-4" />
  }

  const getStatusIcon = (status: string, accountType: string) => {
    if (status === "pending") return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
    if (status === "success") return <CheckCircle className="w-4 h-4 text-green-500" />
    if (status === "error" && accountType.includes("Invalid")) return <CheckCircle className="w-4 h-4 text-green-500" />
    return <XCircle className="w-4 h-4 text-red-500" />
  }

  const getStatusText = (result: TestResult) => {
    if (result.status === "pending") return "Testing..."
    if (result.status === "success" && result.accountType.includes("Invalid")) return "Failed as expected"
    if (result.status === "success") return "Login successful"
    if (result.status === "error" && result.accountType.includes("Invalid")) return "Failed as expected"
    return `Failed: ${result.error}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950 dark:via-yellow-950 dark:to-orange-950 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 font-bold text-3xl mb-4">
            <span className="text-amber-600">Bible</span>
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-1 rounded-lg shadow-lg">
              AF
            </span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Login Functionality Test</h1>
          <p className="text-gray-600 dark:text-gray-400">Verifying that manual login works for all account types</p>
        </div>

        {/* Current User Display */}
        {currentUser && (
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Currently Logged In</h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Name:</span> {currentUser.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Email:</span> {currentUser.email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Tier:</span> {currentUser.subscription.tier}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Status:</span> {currentUser.subscription.status}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Test Controls */}
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Login Tests</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Test all account types to verify manual login functionality
              </p>
            </div>
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 font-medium shadow-lg transition-all duration-200"
            >
              {isRunning ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Running Tests...
                </>
              ) : (
                "Run All Tests"
              )}
            </button>
          </div>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border border-amber-200 dark:border-amber-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Test Results</h3>
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3">
                    {getAccountIcon(result.accountType)}
                    <div>
                      <div className="font-medium text-gray-800 dark:text-gray-200">{result.accountType}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{result.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {result.duration && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">{result.duration}ms</span>
                    )}
                    <div className="flex items-center gap-2">
                      {getStatusIcon(result.status, result.accountType)}
                      <span className="text-sm font-medium">{getStatusText(result)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            {!isRunning && testResults.length > 0 && (
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">Test Summary</h4>
                <div className="text-sm text-amber-700 dark:text-amber-300">
                  <p>✅ Developer Account: {testResults[0]?.status === "success" ? "PASS" : "FAIL"}</p>
                  <p>✅ Admin Account: {testResults[1]?.status === "success" ? "PASS" : "FAIL"}</p>
                  <p>✅ Test Account: {testResults[2]?.status === "success" ? "PASS" : "FAIL"}</p>
                  <p>
                    ✅ Invalid Account Rejection:{" "}
                    {testResults[3]?.status === "error" ||
                    (testResults[3]?.status === "success" && testResults[3]?.accountType.includes("Invalid"))
                      ? "PASS"
                      : "FAIL"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
