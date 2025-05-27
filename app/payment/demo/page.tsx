"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import { Sun, Moon, CreditCard, Check } from "lucide-react"

export default function PaymentDemoPage() {
  const { theme, setTheme } = useTheme()
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success">("idle")

  const handlePayment = () => {
    setPaymentStatus("processing")
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentStatus("success")
    }, 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Image 
              src="/christian-logo.png" 
              alt="BibleAF Logo" 
              width={36} 
              height={36} 
              className="mr-1"
            />
            <span className="text-primary">Bible</span>
            <span className="bg-secondary text-secondary-foreground px-1 rounded">AF</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-muted"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link
              href="/"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 scripture-button"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Payment Demo</h1>
          
          <div className="bg-background rounded-lg border prayer-card p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Premium Plan</h2>
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-2xl font-bold">$9.99<span className="text-sm text-muted-foreground">/month</span></p>
                <p className="text-muted-foreground">For deeper spiritual growth</p>
              </div>
              <div className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm">
                Most Popular
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-start">
                <span className="text-secondary mr-2">✓</span>
                <span>All Basic features</span>
              </div>
              <div className="flex items-start">
                <span className="text-secondary mr-2">✓</span>
                <span>Unlimited AI-powered searches</span>
              </div>
              <div className="flex items-start">
                <span className="text-secondary mr-2">✓</span>
                <span>Unlimited Life guidance</span>
              </div>
              <div className="flex items-start">
                <span className="text-secondary mr-2">✓</span>
                <span>Advanced verse tagging</span>
              </div>
              <div className="flex items-start">
                <span className="text-secondary mr-2">✓</span>
                <span>Reading progress tracking</span>
              </div>
            </div>
            
            {paymentStatus === "idle" && (
              <button
                onClick={handlePayment}
                className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 flex items-center justify-center gap-2 scripture-button"
              >
                <CreditCard size={18} />
                <span>Process Payment</span>
              </button>
            )}
            
            {paymentStatus === "processing" && (
              <button
                disabled
                className="w-full bg-primary/70 text-primary-foreground py-3 rounded-md flex items-center justify-center gap-2"
              >
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></div>
                <span>Processing...</span>
              </button>
            )}
            
            {paymentStatus === "success" && (
              <div className="space-y-4">
                <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-md flex items-start gap-3">
                  <div className="bg-green-200 dark:bg-green-800 rounded-full p-1 mt-0.5">
                    <Check size={16} className="text-green-700 dark:text-green-300" />
                  </div>
                  <div>
                    <p className="font-medium">Payment Successful!</p>
                    <p className="text-sm mt-1">Your Premium subscription is now active.</p>
                  </div>
                </div>
                
                <Link
                  href="/dashboard"
                  className="w-full bg-secondary text-secondary-foreground py-3 rounded-md hover:bg-secondary/90 flex items-center justify-center gap-2 scripture-button"
                >
                  Go to Dashboard
                </Link>
              </div>
            )}
          </div>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>This is a demo page. No actual payment is processed.</p>
            <p className="mt-1">In a production environment, this would connect to a payment processor like Stripe.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Image 
                src="/christian-logo.png" 
                alt="BibleAF Logo" 
                width={24} 
                height={24} 
              />
              <span className="text-sm">BibleAF</span>
            </div>
            <div className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} BibleAF. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
