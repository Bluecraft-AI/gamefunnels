import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Game Funnels',
  description: 'Check Out Our Games Below',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/images/favicon.svg" />
      </head>
      <body>{children}</body>
    </html>
  )
}
