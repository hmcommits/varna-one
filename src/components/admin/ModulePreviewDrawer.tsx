'use client'
import React, { useState } from 'react'
import { X, Smartphone, Tablet, Monitor, Eye } from 'lucide-react'

interface ModulePreviewDrawerProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export default function ModulePreviewDrawer({
  isOpen,
  onClose,
  title,
  children,
}: ModulePreviewDrawerProps) {
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop')

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
      {/* Top Controller Bar */}
      <div className="bg-[#0b120c] border-b border-[#c4a675]/30 px-4 py-3 flex items-center justify-between z-10 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Eye size={17} className="text-[#c4a675]" />
          <h2 className="font-display font-bold text-sm sm:text-base text-[#f4efe6]">
            Preview: {title}
          </h2>
          <span className="text-[10px] bg-[#c4a675]/20 text-[#e8d5b7] px-2 py-0.5 rounded-full font-mono hidden sm:inline-block">
            Draft Staging
          </span>
        </div>

        {/* Viewport Width Switchers */}
        <div className="flex items-center gap-1 bg-[#111a13] p-1 rounded-xl border border-[#c4a675]/20">
          <button
            type="button"
            onClick={() => setViewport('mobile')}
            aria-label="Mobile viewport (375px)"
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer ${
              viewport === 'mobile'
                ? 'bg-[#1a2e1a] text-[#e8d5b7] font-bold shadow-xs'
                : 'text-[#a89d8f] hover:text-white'
            }`}
          >
            <Smartphone size={14} />
            <span className="hidden md:inline">Mobile (375px)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport('tablet')}
            aria-label="Tablet viewport (768px)"
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer ${
              viewport === 'tablet'
                ? 'bg-[#1a2e1a] text-[#e8d5b7] font-bold shadow-xs'
                : 'text-[#a89d8f] hover:text-white'
            }`}
          >
            <Tablet size={14} />
            <span className="hidden md:inline">Tablet (768px)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport('desktop')}
            aria-label="Desktop viewport"
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer ${
              viewport === 'desktop'
                ? 'bg-[#1a2e1a] text-[#e8d5b7] font-bold shadow-xs'
                : 'text-[#a89d8f] hover:text-white'
            }`}
          >
            <Monitor size={14} />
            <span className="hidden md:inline">Desktop</span>
          </button>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-[#f4efe6] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close preview"
        >
          <X size={18} />
        </button>
      </div>

      {/* Preview Stage Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-start justify-center bg-[#151d16]/70">
        <div
          className={`transition-all duration-300 mx-auto rounded-3xl overflow-hidden shadow-2xl border border-[#c4a675]/30 bg-[#faf8f4] text-[#1a1a1a] ${
            viewport === 'mobile'
              ? 'w-[375px] max-w-full'
              : viewport === 'tablet'
              ? 'w-[768px] max-w-full'
              : 'w-full max-w-6xl'
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
