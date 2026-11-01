'use client'
import Image from 'next/image'
import { useStore } from '@/context/StoreContext'

export default function WhatsAppButton() {
  const { activeStore, logEnquiry } = useStore()

  const wa = activeStore.whatsapp || {
    phoneNumber: '916363145972',
    floatingButtonVisible: true,
    floatingButtonText: 'Enquire',
    luminousGlow: true,
    templateGeneral:
      "Hi Varna! I'm browsing your storefront and would like to ask a few questions about your collections and custom printing.",
  }

  if (wa.floatingButtonVisible === false) {
    return null
  }

  const phone = wa.phoneNumber || '916363145972'
  const message =
    wa.templateGeneral ||
    "Hi Varna! I'm browsing your storefront and would like to ask a few questions about your collections and custom printing."
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

  const handleClick = () => {
    logEnquiry({
      productName: 'General Floating Concierge',
      color: 'N/A',
      size: 'N/A',
      quantity: 1,
      source: 'Floating Concierge',
      completed: false,
    })
  }

  return (
    <div
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9999] pointer-events-auto select-none"
      style={{ zIndex: 9999 }}
    >
      <div className="relative">
        {/* Ambient breathing luminous glow */}
        {wa.luminousGlow !== false && (
          <span className="absolute -inset-1.5 sm:-inset-2 rounded-full bg-[#25D366] whatsapp-gentle-glow -z-10 pointer-events-none blur-[2px]" />
        )}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          aria-label="Enquire on WhatsApp"
          className="inline-flex items-center gap-2.5 sm:gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm sm:text-base px-4 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-[0_8px_24px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-white/95 cursor-pointer group"
        >
          {/* WhatsApp Logo Icon */}
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
            <Image
              src="/images/icons/whatsapp.webp"
              alt="WhatsApp"
              fill
              sizes="32px"
              quality={95}
              priority
              unoptimized={true}
              className="object-cover"
            />
          </div>

          {/* Text */}
          <span className="tracking-wide font-bold drop-shadow-xs pr-0.5">
            {wa.floatingButtonText || 'Enquire'}
          </span>
        </a>
      </div>
    </div>
  )
}
