'use client'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const shopLinks = ['New Arrivals', 'Men', 'Women', 'Collections', 'Sale']
const helpLinks = ['Custom Orders', 'Bulk Enquiries', 'Size Guide', 'FAQs', 'Contact Us']

const WHATSAPP_ENQUIRY_URL =
  "https://wa.me/916363145972?text=Hi%20Varna!%20I'm%20interested%20in%20your%20styles%20and%20would%20like%20to%20place%20an%20enquiry."

export default function Footer() {
  const router = useRouter()
  const [tapCount, setTapCount] = useState(0)
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    router.prefetch('/admin/login')
  }, [router])

  const handleFooterLogoTap = (e: React.MouseEvent) => {
    e.preventDefault()
    const next = tapCount + 1
    setTapCount(next)

    if (tapTimerRef.current) clearTimeout(tapTimerRef.current)

    if (next >= 5) {
      setTapCount(0)
      router.push('/admin/login')
      return
    }

    tapTimerRef.current = setTimeout(() => {
      if (next === 1) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      setTapCount(0)
    }, 450)
  }

  return (
    <footer className="bg-[#111] text-[#a89d8f] py-12 px-4 text-xs sm:text-sm border-t border-[#e8d5b7]/15">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-12 gap-8 mb-10">
        {/* Brand Description with Emblem & 5-Tap Gateway */}
        <div className="col-span-2 md:col-span-4 pr-0 md:pr-8">
          <div
            onClick={handleFooterLogoTap}
            className="flex items-center gap-3 mb-4 group cursor-pointer select-none"
            title="Varna Custom Wear"
          >
            <div className={`relative w-12 h-12 flex-shrink-0 rounded-full transition-transform ${tapCount > 0 ? 'scale-105 ring-2 ring-[#c4a675]' : ''}`}>
              <Image
                src="https://res.cloudinary.com/o6jv6xte/image/upload/v1793532654/varna_store/logo/varna-emblem.webp"
                alt="Varna Custom Wear & Prints"
                fill
                sizes="48px"
                className="object-contain"
                unoptimized
              />
            </div>
            <div>
              <span className="font-display italic text-white text-2xl font-bold tracking-tight block leading-tight">
                Varna
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#e8d5b7] font-medium">
                Custom Wear &amp; Prints
              </span>
            </div>
          </div>
          <p className="text-xs text-[#a89d8f] leading-relaxed max-w-sm mb-4">
            Custom wear, prints, t-shirts, jerseys &amp; hoodies. Crafted for comfort, curated to impress. Wear Your Colors with Varna.
          </p>
          <div className="flex items-center gap-2 text-xs text-[#a89d8f]">
            <span>Enquiries:</span>
            <a
              href={WHATSAPP_ENQUIRY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:underline font-semibold flex items-center gap-1"
            >
              +91 6363145972
            </a>
          </div>
        </div>

        {/* Shop Navigation */}
        <div className="col-span-1 md:col-span-2">
          <h4 className="font-semibold text-white uppercase tracking-wider text-xs mb-3">Shop</h4>
          <ul className="space-y-2">
            {shopLinks.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
                  className="hover:text-white transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Care */}
        <div className="col-span-1 md:col-span-3">
          <h4 className="font-semibold text-white uppercase tracking-wider text-xs mb-3">Customer Care</h4>
          <ul className="space-y-2">
            {helpLinks.map((link) => (
              <li key={link}>
                <a
                  href={WHATSAPP_ENQUIRY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Brand & Studio */}
        <div className="col-span-2 md:col-span-3">
          <h4 className="font-semibold text-white uppercase tracking-wider text-xs mb-3">Studio &amp; Hours</h4>
          <p className="text-xs text-[#a89d8f] mb-3 leading-relaxed">
            Bengaluru Flagship Studio • Open 10 AM – 9 PM daily for bespoke styling &amp; orders.
          </p>
          <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] text-[#7d7062]">
            <span>⚡ Ultra-fast WhatsApp Checkout</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7d7062]">
        <p>© 2026 Varna. All rights reserved. Crafted for comfort, curated to impress.</p>
        <p className="text-[11px]">Direct WhatsApp Concierge Commerce Engine</p>
      </div>
    </footer>
  )
}
