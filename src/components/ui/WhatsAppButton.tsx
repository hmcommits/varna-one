'use client'
import Image from 'next/image'

const WHATSAPP_NUMBER = '916363145972'
const DEFAULT_MESSAGE = encodeURIComponent(
  "Hi Varna! I'm interested in your styles and would like to place an enquiry."
)

export default function WhatsAppButton() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${DEFAULT_MESSAGE}`

  return (
    <div
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9999] pointer-events-auto select-none"
      style={{ zIndex: 9999 }}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Enquire on WhatsApp"
        className="inline-flex items-center gap-2.5 sm:gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm sm:text-base px-4 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-[0_8px_28px_rgba(37,211,102,0.55)] hover:shadow-[0_12px_36px_rgba(37,211,102,0.75)] hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-white/95 cursor-pointer group"
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
        <span className="tracking-wide font-bold drop-shadow-sm pr-0.5">
          Enquire
        </span>
      </a>
    </div>
  )
}
