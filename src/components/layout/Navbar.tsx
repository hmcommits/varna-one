'use client'
import { useState } from 'react'
import { Search, Menu, X, ArrowRight, MessageCircle } from 'lucide-react'
import Image from 'next/image'

const navLinks = [
  { label: 'New Arrivals', href: '#new-arrivals' },
  { label: 'Men', href: '#men' },
  { label: 'Women', href: '#women' },
  { label: 'Collections', href: '#collections' },
  { label: 'Accessories', href: '#accessories' },
  { label: 'Sale', href: '#sale', isRed: true },
]

const WHATSAPP_ENQUIRY_URL =
  "https://wa.me/916363145972?text=Hi%20Varna!%20I'm%20interested%20in%20your%20styles%20and%20would%20like%20to%20place%20an%20enquiry."

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleNavClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setMobileOpen(false)
  }

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 sm:h-18">
        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden -ml-2 p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
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
            <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-gray-500 uppercase mt-0.5 hidden xs:block">
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
                link.isRed ? 'text-[#e05c4b] font-semibold' : 'text-gray-700 hover:text-[#1a2e1a]'
              }`}
            >
              {link.label}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#1a2e1a] group-hover:w-full transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Right Action: Clean Search Bar */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 bg-[#faf8f4] border border-gray-200/80 rounded-full px-3.5 py-1.5 focus-within:border-[#1a2e1a] focus-within:bg-white transition-all">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search t-shirts, jerseys, hoodies..."
              className="bg-transparent text-xs outline-none w-48 lg:w-64 text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Mobile Search Input */}
          <div className="flex items-center gap-2 bg-[#faf8f4] border border-gray-200 rounded-full px-4 py-2.5 mb-4">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search t-shirts, jerseys, hoodies..."
              className="bg-transparent text-xs outline-none w-full text-gray-800 placeholder-gray-400"
            />
          </div>

          {/* Mobile Nav Links */}
          <div className="flex flex-col divide-y divide-gray-100">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={handleNavClick}
                className={`py-3 text-sm font-medium flex items-center justify-between cursor-pointer ${
                  link.isRed ? 'text-[#e05c4b] font-semibold' : 'text-gray-800 hover:text-[#1a2e1a]'
                }`}
              >
                <span>{link.label}</span>
                <ArrowRight size={14} className="text-gray-400" />
              </a>
            ))}
          </div>

          {/* Mobile Footer WhatsApp Action */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <span className="font-medium">Have an enquiry?</span>
            <a
              href={WHATSAPP_ENQUIRY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#25D366] font-bold"
            >
              <MessageCircle size={14} />
              <span>WhatsApp Support</span>
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
