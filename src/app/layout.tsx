import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter, Alex_Brush } from 'next/font/google'
import './globals.css'
import { StoreProvider } from '@/context/StoreContext'
import AppShell from '@/components/layout/AppShell'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const alexBrush = Alex_Brush({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'Varna – Custom Wear & Prints',
  description: "T-Shirts, Jerseys, Hoodies & Elevated Everyday Styles. Wear Your Colors with Varna.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${alexBrush.variable}`}>
      <body className="min-h-screen bg-[#faf8f4] text-[#1a1a1a] antialiased selection:bg-[#1a2e1a] selection:text-white">
        <StoreProvider>
          <AppShell>{children}</AppShell>
        </StoreProvider>
      </body>
    </html>
  )
}
