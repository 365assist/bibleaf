import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface NavigationMenuProps {
  className?: string
  children?: React.ReactNode
}

const NavigationMenu = React.forwardRef<HTMLDivElement, NavigationMenuProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative z-10 flex max-w-max flex-1 items-center justify-center", className)}
      {...props}
    >
      {children}
    </div>
  ),
)
NavigationMenu.displayName = "NavigationMenu"

const NavigationMenuList = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      className={cn("group flex flex-1 list-none items-center justify-center space-x-1", className)}
      {...props}
    />
  ),
)
NavigationMenuList.displayName = "NavigationMenuList"

const NavigationMenuItem = React.forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn("relative", className)} {...props} />,
)
NavigationMenuItem.displayName = "NavigationMenuItem"

const navigationMenuTriggerStyle = cn(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50",
)

interface NavigationMenuLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  asChild?: boolean
}

const NavigationMenuLink = React.forwardRef<HTMLAnchorElement, NavigationMenuLinkProps>(
  ({ className, asChild, children, ...props }, ref) => {
    if (asChild) {
      return <>{children}</>
    }
    return (
      <Link ref={ref} className={cn(navigationMenuTriggerStyle, className)} {...props}>
        {children}
      </Link>
    )
  },
)
NavigationMenuLink.displayName = "NavigationMenuLink"

const NavigationMenuTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, children, ...props }, ref) => (
    <button ref={ref} className={cn(navigationMenuTriggerStyle, "group", className)} {...props}>
      {children}
    </button>
  ),
)
NavigationMenuTrigger.displayName = "NavigationMenuTrigger"

const NavigationMenuContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute left-0 top-full z-50 w-full rounded-md border bg-popover p-4 text-popover-foreground shadow-md",
        className,
      )}
      {...props}
    />
  ),
)
NavigationMenuContent.displayName = "NavigationMenuContent"

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuTrigger,
  NavigationMenuContent,
}
