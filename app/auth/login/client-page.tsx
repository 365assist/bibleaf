"use client"

import dynamic from 'next/dynamic'
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"

// Dynamically import AuthService with ssr: false to prevent server-side evaluation
const DynamicAuthComponent = dynamic(
  () => import('@/components/auth-login-component').then((mod) => mod.AuthLoginComponent),
  { ssr: false }
)

export default function ClientLoginPage() {
  const { theme, setTheme } = useTheme()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image 
                src="/christian-logo.png" 
                alt="BibleAF Logo" 
                width={60} 
                height={60} 
              />
            </div>
            <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
              <span className="text-primary">Bible</span>
              <span className="bg-secondary text-secondary-foreground px-1 rounded">AF</span>
            </h1>
            <h2 className="text-xl font-bold mt-4">Welcome back</h2>
            <p className="text-muted-foreground">Sign in to your account</p>
          </div>

          <DynamicAuthComponent 
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            error={error}
            setError={setError}
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-secondary hover:text-secondary/80">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <footer className="border-t">
        <div className="container py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Image 
                src="/christian-logo.png" 
                alt="BibleAF Logo" 
                width={24} 
                height={24} 
              />
              <span className="text-sm">BibleAF</span>
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-muted"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
