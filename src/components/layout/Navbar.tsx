'use client'
import { useState, useRef, useEffect } from 'react'
import { Search, Menu, X, Shield, Lock } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStore } from '@/context/StoreContext'

const navLinks = [
  { label: 'New Arrivals', href: '/#new-arrivals' },
  { label: 'Men', href: '/#men' },
  { label: 'Women', href: '/#women' },
  { label: 'Collections', href: '/#collections' },
  { label: 'Accessories', href: '/#accessories' },
  { label: 'Sale', href: '/#sale', isRed: true },
]

export default function Navbar() {
  const router = useRouter()
  const { activeStore } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // 5-Tap Easter Egg Detection
  const [tapCount, setTapCount] = useState(0)
  const [isUnlocking, setIsUnlocking] = useState(false)
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Prefetch admin routes in background so the 5-tap transition is instant
  useEffect(() => {
    router.prefetch('/admin/login')
    router.prefetch('/admin')
  }, [router])

  const handleLogoTap = (e: React.MouseEvent) => {
    // Intercept default navigation so tapping 1, 2, 3, 4 times doesn't trigger page reloads
    e.preventDefault()

    const nextCount = tapCount + 1
    setTapCount(nextCount)

    // Optional haptic pulse on mobile devices
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(30)
    }

    if (tapTimerRef.current) clearTimeout(tapTimerRef.current)

    // On 5th tap -> Immediate Vault Unlock
    if (nextCount >= 5) {
      setIsUnlocking(true)
      setTapCount(0)
      router.push('/admin/login')
      return
    }

    // Reset tap counter if user stops tapping after 450ms
    tapTimerRef.current = setTimeout(() => {
      // If user only clicked once (standard logo click), navigate to home
      if (nextCount === 1) {
        router.push('/')
      }
      setTapCount(0)
    }, 450)
  }

  const logoSrc =
    activeStore.settings?.logoUrl ||
    'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532654/varna_store/logo/varna-emblem.webp'
  const storeName = activeStore.settings?.storeName || 'Varna'
  const subtitle = activeStore.settings?.subtitle || 'Custom Wear & Prints'

  return (
    <>
      {/* Full-Screen Vault Entry Transition Overlay */}
      {isUnlocking && (
        <div className="fixed inset-0 z-50 bg-[#0f1d14]/95 backdrop-blur-md flex flex-col items-center justify-center text-white animate-in fade-in duration-200">
          <div className="relative w-20 h-20 rounded-full p-3 bg-[#183220] border-2 border-[#c4a675] shadow-[0_0_50px_rgba(196,166,117,0.4)] animate-pulse mb-4">
            <Image
              src={logoSrc}
              alt="Varna"
              fill
              className="object-contain p-2"
              priority
              unoptimized
            />
          </div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} className="text-[#c4a675]" />
            <h2 className="font-display text-2xl font-bold tracking-tight text-[#f4efe6]">
              Varna Command Vault
            </h2>
          </div>
          <p className="text-xs text-[#9eb3a2] font-mono uppercase tracking-widest flex items-center gap-1.5 mt-1">
            <Lock size={12} className="text-[#25D366]" />
            <span>Authenticating Secure Access...</span>
          </p>
          <div className="w-56 h-1.5 bg-white/10 rounded-full overflow-hidden mt-6">
            <div className="w-full h-full bg-gradient-to-r from-[#c4a675] via-[#25D366] to-[#c4a675] rounded-full animate-pulse" />
          </div>
        </div>
      )}

      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-[#e8d5b7]/50 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 sm:h-18">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden -ml-2 p-2 text-[#3d362e] hover:text-black hover:bg-[#faf8f4] rounded-lg transition-colors cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          {/* Brand Logo with the Emblem & 5-Tap Unlock Trigger */}
          <Link
            href="/"
            onClick={handleLogoTap}
            className={`flex items-center gap-2.5 hover:opacity-90 transition-all cursor-pointer group py-1 relative select-none ${
              isUnlocking ? 'scale-105' : ''
            }`}
            title="Varna Custom Wear"
          >
            <div
              className={`relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 transition-transform duration-300 rounded-full ${
                isUnlocking
                  ? 'ring-4 ring-[#c4a675] shadow-[0_0_20px_#c4a675] animate-pulse'
                  : tapCount > 0
                  ? 'ring-2 ring-[#c4a675]/60 scale-105'
                  : ''
              }`}
            >
              <Image
                src={logoSrc}
                alt={storeName}
                fill
                sizes="48px"
                priority
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display italic text-xl sm:text-2xl font-bold text-[#1a2e1a] tracking-tight leading-none">
                {storeName}
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-[#7d7062] uppercase mt-0.5 hidden xs:block">
                {subtitle}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors py-1 relative group cursor-pointer ${
                  link.isRed ? 'text-[#c85a44] font-semibold' : 'text-[#3d362e] hover:text-[#1a2e1a]'
                }`}
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a2e1a] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* Right Action: Clean Search Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden md:flex items-center gap-2 bg-[#faf8f4] border border-[#e8d5b7]/70 rounded-full px-3.5 py-1.5 focus-within:border-[#1a2e1a] focus-within:bg-white transition-all shadow-xs">
              <Search size={15} className="text-[#8a7d6e] flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search t-shirts, jerseys, hoodies..."
                className="bg-transparent text-xs outline-none w-48 lg:w-64 text-[#1a1a1a] placeholder-[#8a7d6e]"
              />
            </div>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#e8d5b7]/50 bg-white/98 backdrop-blur-md px-5 py-4 space-y-3">
            {/* Mobile Search */}
            <div className="flex items-center gap-2 bg-[#faf8f4] border border-[#e8d5b7]/70 rounded-full px-3.5 py-2 mb-3">
              <Search size={16} className="text-[#8a7d6e]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search designs..."
                className="bg-transparent text-xs outline-none w-full text-[#1a1a1a] placeholder-[#8a7d6e]"
              />
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-sm py-2 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
                    link.isRed ? 'text-[#c85a44] font-semibold bg-[#c85a44]/5' : 'text-[#3d362e] hover:bg-[#faf8f4]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  )
}
