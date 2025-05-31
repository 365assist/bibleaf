"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SystemStatus {
  stripe: boolean
  deepInfra: boolean
  elevenLabs: boolean
  blobStorage: boolean
  npm: boolean
  nodeEnv: string
}

export default function SystemStatus() {
  const [status, setStatus] = useState<SystemStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch("/api/system/status")
      if (!response.ok) {
        throw new Error("Failed to fetch system status")
      }
      const data = await response.json()
      setStatus(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStatus()
  }, [])

  const getStatusIcon = (configured: boolean) => {
    if (configured) {
      return <CheckCircle className="h-4 w-4 text-green-500" />
    }
    return <XCircle className="h-4 w-4 text-red-500" />
  }

  const getStatusBadge = (configured: boolean, label: string) => {
    return (
      <Badge variant={configured ? "default" : "secondary"} className="flex items-center gap-1">
        {getStatusIcon(configured)}
        {label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card className="divine-light-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            System Status
          </CardTitle>
          <CardDescription>Checking system configuration...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="divine-light-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            System Status
          </CardTitle>
          <CardDescription>Error loading system status</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchStatus} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!status) {
    return null
  }

  return (
    <Card className="divine-light-card">
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Current configuration and feature availability</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Core Services</h4>
          <div className="grid grid-cols-2 gap-2">
            {getStatusBadge(status.blobStorage, "Blob Storage")}
            {getStatusBadge(status.npm, "NPM Config")}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">AI Services</h4>
          <div className="grid grid-cols-2 gap-2">
            {getStatusBadge(status.deepInfra, "Deep Infra")}
            {getStatusBadge(status.elevenLabs, "ElevenLabs")}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Payment Services</h4>
          <div className="grid grid-cols-1 gap-2">{getStatusBadge(status.stripe, "Stripe")}</div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Environment</h4>
          <Badge variant="outline">{status.nodeEnv}</Badge>
        </div>

        <div className="pt-2">
          <Button onClick={fetchStatus} variant="outline" size="sm" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Status
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
