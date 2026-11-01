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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md flex flex-col animate-in fade-in duration-200">
      {/* Top Controller Bar */}
      <div className="bg-white border-b border-[#ebe5da] px-4 py-3 flex items-center justify-between z-10 shrink-0 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <Eye size={17} className="text-[#845d1d]" />
          <h2 className="font-display font-bold text-sm sm:text-base text-[#142319]">
            Preview: {title}
          </h2>
          <span className="text-[10px] bg-[#eef7f0] text-[#206035] border border-[#d6ecda] px-2.5 py-0.5 rounded-full font-mono font-bold hidden sm:inline-block">
            Draft Staging
          </span>
        </div>

        {/* Viewport Width Switchers */}
        <div className="flex items-center gap-1 bg-[#faf6f0] p-1 rounded-xl border border-[#ded7cb]">
          <button
            type="button"
            onClick={() => setViewport('mobile')}
            aria-label="Mobile viewport (375px)"
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewport === 'mobile'
                ? 'bg-[#1c3624] text-white font-bold shadow-2xs'
                : 'text-[#556358] hover:text-[#142319]'
            }`}
          >
            <Smartphone size={14} />
            <span className="hidden md:inline">Mobile (375px)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport('tablet')}
            aria-label="Tablet viewport (768px)"
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewport === 'tablet'
                ? 'bg-[#1c3624] text-white font-bold shadow-2xs'
                : 'text-[#556358] hover:text-[#142319]'
            }`}
          >
            <Tablet size={14} />
            <span className="hidden md:inline">Tablet (768px)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport('desktop')}
            aria-label="Desktop viewport"
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              viewport === 'desktop'
                ? 'bg-[#1c3624] text-white font-bold shadow-2xs'
                : 'text-[#556358] hover:text-[#142319]'
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
          className="w-8 h-8 rounded-full bg-[#faf6f0] hover:bg-[#f0ece4] border border-[#ded7cb] text-[#142319] flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close preview"
        >
          <X size={16} />
        </button>
      </div>

      {/* Preview Stage Container */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-start justify-center bg-[#142319]/25 backdrop-blur-xs">
        <div
          className={`transition-all duration-300 mx-auto rounded-3xl overflow-hidden shadow-2xl border border-[#ded7cb] bg-[#faf8f5] text-[#142319] ${
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
