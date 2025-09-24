
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LifeSaver ERN - Emergency Response Network',
  description: 'AI-powered emergency response system for opiate overdose prevention and recovery support',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
            {children}
          </main>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
