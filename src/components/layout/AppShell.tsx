'use client'
import React from 'react'
import { usePathname } from 'next/navigation'
import TopBar from '@/components/layout/TopBar'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/ui/WhatsAppButton'
import GlobalPreviewBanner from '@/components/admin/GlobalPreviewBanner'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  if (isAdminRoute) {
    return <main className="min-h-screen bg-[#0b120c] text-[#f4efe6]">{children}</main>
  }

  return (
    <>
      <GlobalPreviewBanner />
      <TopBar />
      <Navbar />
      <main className="overflow-x-clip">{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
