'use client'
import { Truck, Sparkles, MessageCircle } from 'lucide-react'
import { useStore } from '@/context/StoreContext'

export default function TopBar() {
  const { activeStore } = useStore()

  if (activeStore.homepage && !activeStore.homepage.topBarVisible) {
    return null
  }

  const texts = activeStore.homepage?.topBarTexts?.length
    ? activeStore.homepage.topBarTexts
    : [
        'Free shipping on orders above ₹999',
        'Custom Wear & Prints',
        'Wear Your Colors',
      ]

  const phoneNumber = activeStore.whatsapp?.phoneNumber || '916363145972'
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    "Hi Varna! I'm interested in your styles and would like to place an enquiry."
  )}`

  return (
    <div className="bg-[#1a2e1a] text-white text-[11px] md:text-xs py-2 px-3 md:px-4 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Mobile View (< sm): continuous smooth marquee so no text is ever clipped on narrow screens */}
        <div className="sm:hidden flex-1 overflow-hidden relative mr-2">
          {/* Subtle edge gradient masks for smooth entry and exit */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-[#1a2e1a] to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-3 bg-gradient-to-l from-[#1a2e1a] to-transparent z-10" />

          <div className="topbar-marquee">
            {[...texts, ...texts].map((text, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 font-medium tracking-wide mx-3 text-white/95 whitespace-nowrap"
              >
                {idx % 2 === 0 ? (
                  <Truck size={12} className="text-[#e8d5b7] flex-shrink-0" />
                ) : (
                  <Sparkles size={12} className="text-[#e8d5b7] flex-shrink-0" />
                )}
                <span>{text}</span>
                <span className="text-[#e8d5b7]/50 ml-3">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Desktop View (sm: and up): pristine static row */}
        <div className="hidden sm:flex items-center gap-3 sm:gap-5 overflow-hidden whitespace-nowrap">
          {texts.map((text, idx) => (
            <span key={idx} className="flex items-center gap-2">
              {idx > 0 && <span className="text-white/30">|</span>}
              <span className="flex items-center gap-1.5 font-medium tracking-wide text-gray-200">
                {idx === 0 ? (
                  <Truck size={13} className="text-[#e8d5b7] flex-shrink-0" />
                ) : (
                  <Sparkles size={12} className="text-[#e8d5b7] flex-shrink-0" />
                )}
                <span>{text}</span>
              </span>
            </span>
          ))}
        </div>

        {/* Right Contact Enquiry Link */}
        <div className="flex items-center gap-1.5 sm:gap-3 text-gray-300 flex-shrink-0 text-[11px] pl-2 border-l border-white/15">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-[#25D366] text-gray-200 transition-colors cursor-pointer"
          >
            <MessageCircle size={12} className="text-[#25D366] flex-shrink-0" />
            <span className="hidden xs:inline">Enquire: </span>
            <span>+{phoneNumber}</span>
          </a>
        </div>
      </div>
    </div>
  )
}
