"use client"

import { useEffect, useState } from 'react'
import { AuthService } from '@/lib/client-auth'

interface AuthProviderProps {
  children: React.ReactNode
  setUser: (user: any) => void
}

export function AuthProvider({ children, setUser }: AuthProviderProps) {
  useEffect(() => {
    // Get user data on client-side only
    const userData = AuthService.getCurrentUser()
    setUser(userData)
  }, [setUser])

  return <>{children}</>
}
