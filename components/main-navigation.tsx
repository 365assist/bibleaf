"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { AuthService } from "@/lib/auth"
import {
  Menu,
  Search,
  BookOpen,
  Heart,
  MessageCircle,
  Settings,
  User,
  LogOut,
  LogIn,
  Home,
  Info,
  HelpCircle,
  Gift,
  Crown,
  Sun,
  Moon,
  Laptop,
} from "lucide-react"
import { useTheme } from "next-themes"

export function MainNavigation() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setIsMounted(true)
    const user = AuthService.getCurrentUser()
    setIsLoggedIn(!!user)
    setUserId(user?.id || null)
  }, [])

  const handleLogout = () => {
    AuthService.logout()
    setIsLoggedIn(false)
    setUserId(null)
    window.location.href = "/"
  }

  const isActive = (path: string) => {
    if (path === "/" && pathname !== "/") return false
    return pathname?.startsWith(path)
  }

  // Don't render anything during SSR to prevent hydration mismatch
  if (!isMounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>
                  <Link href="/" className="flex items-center gap-2">
                    <span className="font-bold text-xl">Bible</span>
                    <span className="bg-primary text-primary-foreground px-2 py-1 rounded-lg text-xl">AF</span>
                  </Link>
                </SheetTitle>
                <SheetDescription>AI-powered Bible study for modern believers</SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  href="/"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent",
                    isActive("/") && "bg-accent font-medium",
                  )}
                >
                  <Home className="h-5 w-5" />
                  Home
                </Link>
                <Link
                  href="/dashboard"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent",
                    isActive("/dashboard") && "bg-accent font-medium",
                  )}
                >
                  <Search className="h-5 w-5" />
                  Bible Search
                </Link>
                <Link
                  href="/bible"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent",
                    isActive("/bible") && "bg-accent font-medium",
                  )}
                >
                  <BookOpen className="h-5 w-5" />
                  Read Bible
                </Link>
                <Link
                  href="/daily-verse"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent",
                    isActive("/daily-verse") && "bg-accent font-medium",
                  )}
                >
                  <Gift className="h-5 w-5" />
                  Daily Verse
                </Link>
                <Link
                  href="/guidance"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent",
                    isActive("/guidance") && "bg-accent font-medium",
                  )}
                >
                  <Heart className="h-5 w-5" />
                  Life Guidance
                </Link>
                <Link
                  href="/heart-to-heart"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent",
                    isActive("/heart-to-heart") && "bg-accent font-medium",
                  )}
                >
                  <MessageCircle className="h-5 w-5" />
                  Heart to Heart
                </Link>

                <div className="border-t my-4"></div>

                <Link
                  href="/pricing"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent",
                    isActive("/pricing") && "bg-accent font-medium",
                  )}
                >
                  <Crown className="h-5 w-5" />
                  Pricing
                </Link>
                <Link
                  href="/about"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent",
                    isActive("/about") && "bg-accent font-medium",
                  )}
                >
                  <Info className="h-5 w-5" />
                  About
                </Link>
                <Link
                  href="/contact"
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent",
                    isActive("/contact") && "bg-accent font-medium",
                  )}
                >
                  <HelpCircle className="h-5 w-5" />
                  Contact
                </Link>

                <div className="border-t my-4"></div>

                {isLoggedIn ? (
                  <>
                    <Link
                      href="/settings"
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent",
                        isActive("/settings") && "bg-accent font-medium",
                      )}
                    >
                      <Settings className="h-5 w-5" />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent text-left"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/auth/login"
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent",
                        isActive("/auth/login") && "bg-accent font-medium",
                      )}
                    >
                      <LogIn className="h-5 w-5" />
                      Login
                    </Link>
                    <Link
                      href="/auth/signup"
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-md hover:bg-accent",
                        isActive("/auth/signup") && "bg-accent font-medium",
                      )}
                    >
                      <User className="h-5 w-5" />
                      Sign Up
                    </Link>
                  </>
                )}

                <div className="border-t my-4"></div>

                <div className="px-4">
                  <p className="text-sm font-medium mb-2">Theme</p>
                  <div className="flex gap-2">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("light")}
                      className="flex-1"
                    >
                      <Sun className="h-4 w-4 mr-1" />
                      Light
                    </Button>
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("dark")}
                      className="flex-1"
                    >
                      <Moon className="h-4 w-4 mr-1" />
                      Dark
                    </Button>
                    <Button
                      variant={theme === "system" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setTheme("system")}
                      className="flex-1"
                    >
                      <Laptop className="h-4 w-4 mr-1" />
                      System
                    </Button>
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mr-6">
          <span className="font-bold text-xl hidden sm:inline">Bible</span>
          <span className="bg-primary text-primary-foreground px-2 py-1 rounded-lg text-xl">AF</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/dashboard" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/dashboard") && "bg-accent text-accent-foreground",
                  )}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Bible Search
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className={isActive("/bible") ? "bg-accent text-accent-foreground" : ""}>
                <BookOpen className="h-4 w-4 mr-2" />
                Read Bible
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-amber-500 to-amber-700 p-6 no-underline outline-none focus:shadow-md"
                        href="/bible"
                      >
                        <BookOpen className="h-6 w-6 text-white" />
                        <div className="mt-4 mb-2 text-lg font-medium text-white">Bible Reader</div>
                        <p className="text-sm leading-tight text-white/90">
                          Read the full Bible with AI-powered insights, cross-references, and commentary.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/bible/Genesis/1"
                      >
                        <div className="text-sm font-medium leading-none">Old Testament</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Genesis through Malachi
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/bible/Matthew/1"
                      >
                        <div className="text-sm font-medium leading-none">New Testament</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Matthew through Revelation
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/daily-verse"
                      >
                        <div className="text-sm font-medium leading-none">Daily Verse</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Today's inspiring verse with reflection
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={
                  isActive("/guidance") || isActive("/heart-to-heart") ? "bg-accent text-accent-foreground" : ""
                }
              >
                <Heart className="h-4 w-4 mr-2" />
                AI Guidance
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <Link
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-green-500 to-green-700 p-6 no-underline outline-none focus:shadow-md"
                        href="/guidance"
                      >
                        <Heart className="h-6 w-6 text-white" />
                        <div className="mt-4 mb-2 text-lg font-medium text-white">Life Guidance</div>
                        <p className="text-sm leading-tight text-white/90">
                          Get biblical wisdom and guidance for life's challenges and decisions.
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/guidance"
                      >
                        <div className="text-sm font-medium leading-none">Divine Guidance</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Biblical wisdom for life decisions
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/heart-to-heart"
                      >
                        <div className="text-sm font-medium leading-none">Heart to Heart</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Conversational spiritual support
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink asChild>
                      <Link
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        href="/topics/comfort"
                      >
                        <div className="text-sm font-medium leading-none">Comfort & Peace</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Find peace in difficult times
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/pricing" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    isActive("/pricing") && "bg-accent text-accent-foreground",
                  )}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Pricing
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="hidden md:inline-flex"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Menu */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link href="/settings">
                <Button variant="ghost" size="icon" className="hidden md:inline-flex">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden md:inline-flex">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm" className="hidden md:inline-flex">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="hidden md:inline-flex">
                  <User className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
