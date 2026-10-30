'use client'
import { Truck, Sparkles, MessageCircle } from 'lucide-react'

const WHATSAPP_URL =
  "https://wa.me/916363145972?text=Hi%20Varna!%20I'm%20interested%20in%20your%20styles%20and%20would%20like%20to%20place%20an%20enquiry."

export default function TopBar() {
  return (
    <div className="bg-[#1a2e1a] text-white text-[11px] md:text-xs py-2 px-3 md:px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 sm:gap-5 overflow-hidden whitespace-nowrap">
          <span className="flex items-center gap-1.5 font-medium tracking-wide">
            <Truck size={13} className="text-[#e8d5b7] flex-shrink-0" />
            Free shipping on orders above ₹999
          </span>
          <span className="hidden sm:inline text-white/30">|</span>
          <span className="hidden sm:flex items-center gap-1.5 text-gray-200">
            <Sparkles size={12} className="text-[#e8d5b7] flex-shrink-0" />
            Custom Wear &amp; Prints
          </span>
          <span className="hidden md:inline text-white/30">|</span>
          <span className="hidden md:flex items-center gap-1.5 text-gray-200">
            Wear Your Colors
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 text-gray-300 flex-shrink-0 text-[11px]">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-[#25D366] text-gray-200 transition-colors cursor-pointer"
          >
            <MessageCircle size={12} className="text-[#25D366]" />
            <span>Enquire: +91 6363145972</span>
          </a>
        </div>
      </div>
    </div>
  )
}
