'use client'
import { useState } from 'react'
import { Search, Menu, X } from 'lucide-react'
import Image from 'next/image'

const navLinks = [
  { label: 'New Arrivals', href: '#new-arrivals' },
  { label: 'Men', href: '#men' },
  { label: 'Women', href: '#women' },
  { label: 'Collections', href: '#collections' },
  { label: 'Accessories', href: '#accessories' },
  { label: 'Sale', href: '#sale', isRed: true },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleNavClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setMobileOpen(false)
  }

  return (
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

        {/* Brand Logo with the Emblem */}
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="flex items-center gap-2.5 hover:opacity-90 transition-opacity cursor-pointer group py-1"
        >
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
            <Image
              src="/images/logo/varna-emblem.webp"
              alt="Varna Custom Wear & Prints"
              fill
              sizes="48px"
              priority
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display italic text-xl sm:text-2xl font-bold text-[#1a2e1a] tracking-tight leading-none">
              Varna
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-[#7d7062] uppercase mt-0.5 hidden xs:block">
              Custom Wear &amp; Prints
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={handleNavClick}
              className={`text-sm font-medium tracking-wide transition-colors py-1 relative group cursor-pointer ${
                link.isRed ? 'text-[#c85a44] font-semibold' : 'text-[#3d362e] hover:text-[#1a2e1a]'
              }`}
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a2e1a] group-hover:w-full transition-all duration-300" />
            </a>
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
              <a
                key={link.label}
                href={link.href}
                onClick={handleNavClick}
                className={`text-sm py-2 px-3 rounded-lg font-medium transition-colors cursor-pointer ${
                  link.isRed ? 'text-[#c85a44] font-semibold bg-[#c85a44]/5' : 'text-[#3d362e] hover:bg-[#faf8f4]'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
