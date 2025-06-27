import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SKV App Portal',
  description: 'Created with for SKV India employees, by https://adityxrai.vercel.app',
  generator: 'adityxrai',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
