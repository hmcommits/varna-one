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
      <div className="flex-1 overflow-y-auto p-2 sm:p-6 flex items-start justify-center bg-[#0a120c]/70 backdrop-blur-md">
        <div
          className={`transition-all duration-300 mx-auto overflow-hidden bg-[#faf8f5] text-[#142319] ${
            viewport === 'mobile'
              ? 'w-[375px] max-w-full rounded-[40px] border-8 border-[#1f2d22] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] my-2'
              : viewport === 'tablet'
              ? 'w-[768px] max-w-full rounded-[32px] border-8 border-[#1f2d22] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] my-2'
              : 'w-full max-w-6xl rounded-3xl border border-[#ded7cb] shadow-2xl my-2'
          }`}
        >
          {/* Mobile Speaker & Camera Island Bar */}
          {viewport === 'mobile' && (
            <div className="bg-[#1f2d22] py-2 flex items-center justify-center">
              <div className="w-20 h-4 bg-black rounded-full flex items-center justify-end px-2">
                <div className="w-2 h-2 rounded-full bg-[#1f2d22]" />
              </div>
            </div>
          )}

          {/* Tablet Camera Indicator */}
          {viewport === 'tablet' && (
            <div className="bg-[#1f2d22] py-1.5 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-black/60" />
            </div>
          )}

          <div className="max-h-[82vh] overflow-y-auto overflow-x-hidden">
            {children}
          </div>

          {/* Mobile Bottom Home Indicator Bar */}
          {viewport === 'mobile' && (
            <div className="bg-[#faf8f5] py-2 flex items-center justify-center border-t border-[#ebe5da]">
              <div className="w-28 h-1 bg-black/40 rounded-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
