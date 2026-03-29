import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Brand Audit — humbld',
  description: 'Get a deep AI-powered audit of your Instagram presence. Uncover what\'s working, what\'s missing, and your fastest path to growth.',
  openGraph: {
    title: 'Brand Audit — humbld',
    description: 'AI-powered Instagram brand audit. Instant. Honest. Actionable.',
    siteName: 'humbld',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
