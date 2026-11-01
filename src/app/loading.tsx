import React from 'react'
import Image from 'next/image'

export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 z-[999] bg-[#faf8f4] flex flex-col items-center justify-center p-4 selection:bg-[#1a2e1a] selection:text-white">
      {/* Ambient background blur */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#c4a675]/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Luxury Brand Emblem Container */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-2.5 bg-white border border-[#ded7cb] shadow-md mb-4 animate-pulse">
          <Image
            src="https://res.cloudinary.com/o6jv6xte/image/upload/v1793532654/varna_store/logo/varna-emblem.webp"
            alt="Varna"
            fill
            className="object-contain p-1.5"
            priority
            unoptimized
          />
        </div>

        <h1 className="font-display italic text-2xl sm:text-3xl font-bold text-[#1a2e1a] tracking-tight">
          Varna
        </h1>
        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-[#845d1d] font-semibold mt-1">
          Custom Wear &amp; Prints
        </p>

        {/* Sleek Animated Progress Indicator */}
        <div className="w-36 sm:w-44 h-1 bg-[#ebe5da] rounded-full overflow-hidden mt-6">
          <div className="w-full h-full bg-[#1c3624] rounded-full animate-pulse" />
        </div>
        <span className="text-[11px] text-[#78857c] mt-2 font-medium">
          Loading experience...
        </span>
      </div>
    </div>
  )
}
