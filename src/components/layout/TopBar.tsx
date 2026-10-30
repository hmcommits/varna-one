'use client'
import { Truck, Sparkles, MessageCircle } from 'lucide-react'

const WHATSAPP_URL =
  "https://wa.me/916363145972?text=Hi%20Varna!%20I'm%20interested%20in%20your%20styles%20and%20would%20like%20to%20place%20an%20enquiry."

const topBarMessages = [
  { icon: Truck, text: 'Free shipping on orders above ₹999' },
  { icon: Sparkles, text: 'Custom Wear & Prints' },
  { icon: null, text: 'Wear Your Colors' },
]

export default function TopBar() {
  return (
    <div className="bg-[#4A121A] text-white text-[11px] md:text-xs py-2 px-3 md:px-4 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Mobile View (< sm): continuous smooth marquee so no text is ever clipped on narrow screens */}
        <div className="sm:hidden flex-1 overflow-hidden relative mr-2">
          {/* Subtle edge gradient masks for smooth entry and exit */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-[#4A121A] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-[#4A121A] to-transparent z-10" />

          <div className="topbar-marquee">
            {[...topBarMessages, ...topBarMessages].map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 font-medium tracking-wide mx-3 text-white/95 whitespace-nowrap"
              >
                {item.icon && <item.icon size={12} className="text-[#e8d5b7] flex-shrink-0" />}
                <span>{item.text}</span>
                <span className="text-[#e8d5b7]/50 ml-3">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Desktop View (sm: and up): pristine static row */}
        <div className="hidden sm:flex items-center gap-3 sm:gap-5 overflow-hidden whitespace-nowrap">
          <span className="flex items-center gap-1.5 font-medium tracking-wide">
            <Truck size={13} className="text-[#e8d5b7] flex-shrink-0" />
            Free shipping on orders above ₹999
          </span>
          <span className="text-white/30">|</span>
          <span className="flex items-center gap-1.5 text-gray-200">
            <Sparkles size={12} className="text-[#e8d5b7] flex-shrink-0" />
            Custom Wear &amp; Prints
          </span>
          <span className="hidden md:inline text-white/30">|</span>
          <span className="hidden md:flex items-center gap-1.5 text-gray-200">
            Wear Your Colors
          </span>
        </div>

        {/* Right Contact Enquiry Link */}
        <div className="flex items-center gap-1.5 sm:gap-3 text-gray-300 flex-shrink-0 text-[11px] pl-2 border-l border-white/15">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-[#25D366] text-gray-200 transition-colors cursor-pointer"
          >
            <MessageCircle size={12} className="text-[#25D366] flex-shrink-0" />
            <span className="hidden xs:inline">Enquire: </span>
            <span>+91 6363145972</span>
          </a>
        </div>
      </div>
    </div>
  )
}
