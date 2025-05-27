// This file is intentionally empty to prevent metadata inheritance
// from the root layout that might cause build errors
// Moving themeColor from metadata to viewport export

import { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#3b82f6'
}
