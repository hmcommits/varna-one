'use client'
import React, { useState } from 'react'
import { useStore } from '@/context/StoreContext'
import { Eye, Phone, Sparkles } from 'lucide-react'
import ModulePreviewDrawer from '../ModulePreviewDrawer'

export default function WhatsAppModule() {
  const { draft, updateDraft } = useStore()
  const [previewOpen, setPreviewOpen] = useState(false)

  const wa = draft.whatsapp || {
    phoneNumber: '916363145972',
    hoursNote: 'Online 10 AM – 9 PM daily',
    floatingButtonVisible: true,
    floatingButtonText: 'Enquire',
    luminousGlow: true,
    templateGeneral: '',
    templateCard: '',
    templatePdp: '',
    templateCustomPrint: '',
  }

  const handleUpdate = (field: keyof typeof wa, val: any) => {
    updateDraft((prev) => ({
      ...prev,
      whatsapp: {
        ...prev.whatsapp,
        [field]: val,
      },
    }))
  }

  // Simulated live message preview
  const simulatedMessage = wa.templatePdp
    .replace('{product_name}', 'Premium Pure Linen Casual Shirt')
    .replace('{color}', 'Desert Terracotta')
    .replace('{size}', 'M (40")')
    .replace('{quantity}', '1')
    .replace('{custom_notes}', '\n• Custom Request: Initials "HB" on cuff')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#ebe5da] rounded-3xl p-6 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#845d1d] font-mono">
            CONCIERGE &amp; SALES FUNNEL
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#142319] mt-0.5">
            WhatsApp Concierge Manager
          </h2>
          <p className="text-xs text-[#6b7770] mt-0.5">
            Configure phone routing, live message templates with dynamic auto-fill variables, and floating button glow
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#faf6f0] hover:bg-[#f0ece4] border border-[#ded7cb] text-xs font-semibold text-[#142319] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Eye size={14} className="text-[#845d1d]" />
          <span>Preview Chat Simulation</span>
        </button>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Phone & Routing */}
        <div className="bg-white border border-[#ebe5da] rounded-3xl p-6 space-y-4 shadow-2xs">
          <h3 className="font-display text-base font-bold text-[#142319] flex items-center gap-2">
            <Phone size={16} className="text-[#206035]" />
            <span>Target WhatsApp Business Number</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#142319] mb-1">
              Phone Number (with Country Code, no + or spaces)
            </label>
            <input
              type="text"
              value={wa.phoneNumber}
              onChange={(e) => handleUpdate('phoneNumber', e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="916363145972"
              className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl px-3.5 py-2.5 text-sm text-[#142319] font-mono font-bold outline-hidden"
            />
            <p className="text-[11px] text-[#6b7770] mt-1.5">
              Formatted for direct WhatsApp click-to-chat links: <span className="text-[#206035] font-semibold font-mono">wa.me/{wa.phoneNumber}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#142319] mb-1">
              Operating Hours / Availability Note
            </label>
            <input
              type="text"
              value={wa.hoursNote}
              onChange={(e) => handleUpdate('hoursNote', e.target.value)}
              placeholder="e.g., Online 10 AM – 9 PM daily (Typical reply: < 5 mins)"
              className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl px-3 py-2 text-xs text-[#142319] outline-hidden placeholder-[#8c978f]"
            />
          </div>
        </div>

        {/* Floating Concierge Button Appearance */}
        <div className="bg-white border border-[#ebe5da] rounded-3xl p-6 space-y-4 shadow-2xs">
          <h3 className="font-display text-base font-bold text-[#142319] flex items-center gap-2">
            <Sparkles size={16} className="text-[#845d1d]" />
            <span>Floating Concierge Button Tuning</span>
          </h3>

          <div className="space-y-3 bg-[#faf8f5] p-4 rounded-2xl border border-[#ded7cb]">
            <label className="flex items-center justify-between text-xs cursor-pointer">
              <span className="font-semibold text-[#142319]">Show Floating WhatsApp Button</span>
              <input
                type="checkbox"
                checked={wa.floatingButtonVisible}
                onChange={(e) => handleUpdate('floatingButtonVisible', e.target.checked)}
                className="w-4 h-4 rounded text-[#1c3624] focus:ring-[#1c3624] cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs cursor-pointer pt-2.5 border-t border-[#ebe5da]">
              <div>
                <span className="font-semibold text-[#142319] block">Luminous Breathing Glow Aura</span>
                <span className="text-[10px] text-[#6b7770]">Gentle ambient pulse animation on bottom-right</span>
              </div>
              <input
                type="checkbox"
                checked={wa.luminousGlow}
                onChange={(e) => handleUpdate('luminousGlow', e.target.checked)}
                className="w-4 h-4 rounded text-[#1c3624] focus:ring-[#1c3624] cursor-pointer"
              />
            </label>

            <div className="pt-2.5 border-t border-[#ebe5da]">
              <label className="block text-[11px] font-semibold text-[#142319] mb-1">
                Button Label Text
              </label>
              <input
                type="text"
                value={wa.floatingButtonText}
                onChange={(e) => handleUpdate('floatingButtonText', e.target.value)}
                placeholder="Enquire, Chat, Order on WhatsApp"
                className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] rounded-xl px-3 py-1.5 text-xs text-[#142319] outline-hidden placeholder-[#8c978f]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Message Templates */}
      <div className="bg-white border border-[#ebe5da] rounded-3xl p-6 shadow-2xs space-y-5">
        <div>
          <h3 className="font-display text-base font-bold text-[#142319]">
            Dynamic Message Templates
          </h3>
          <p className="text-xs text-[#6b7770]">
            These templates pre-fill when customer clicks a WhatsApp button. Supported placeholders: <code className="text-[#845d1d] font-bold">&#123;product_name&#125;</code>, <code className="text-[#845d1d] font-bold">&#123;color&#125;</code>, <code className="text-[#845d1d] font-bold">&#123;size&#125;</code>, <code className="text-[#845d1d] font-bold">&#123;quantity&#125;</code>, <code className="text-[#845d1d] font-bold">&#123;price&#125;</code>, <code className="text-[#845d1d] font-bold">&#123;custom_notes&#125;</code>.
          </p>
        </div>

        <div className="space-y-4">
          {/* Template 1: PDP Order */}
          <div>
            <label className="block text-xs font-semibold text-[#142319] mb-1">
              1. Product Details Page (PDP) Order Template
            </label>
            <textarea
              rows={4}
              value={wa.templatePdp}
              onChange={(e) => handleUpdate('templatePdp', e.target.value)}
              className="w-full bg-[#faf8f5] border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl p-3 text-xs text-[#142319] outline-hidden font-mono leading-relaxed"
            />
          </div>

          {/* Template 2: Product Card Quick Enquiry */}
          <div>
            <label className="block text-xs font-semibold text-[#142319] mb-1">
              2. Product Card Quick Enquiry Template
            </label>
            <textarea
              rows={2}
              value={wa.templateCard}
              onChange={(e) => handleUpdate('templateCard', e.target.value)}
              className="w-full bg-[#faf8f5] border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl p-3 text-xs text-[#142319] outline-hidden font-mono leading-relaxed"
            />
          </div>

          {/* Template 3: General Store Enquiry */}
          <div>
            <label className="block text-xs font-semibold text-[#142319] mb-1">
              3. General Store &amp; Navbar Enquiry Template
            </label>
            <textarea
              rows={2}
              value={wa.templateGeneral}
              onChange={(e) => handleUpdate('templateGeneral', e.target.value)}
              className="w-full bg-[#faf8f5] border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl p-3 text-xs text-[#142319] outline-hidden font-mono leading-relaxed"
            />
          </div>

          {/* Template 4: Bulk Custom Prints */}
          <div>
            <label className="block text-xs font-semibold text-[#142319] mb-1">
              4. Bulk / Team Custom Printing Enquiry Template
            </label>
            <textarea
              rows={2}
              value={wa.templateCustomPrint}
              onChange={(e) => handleUpdate('templateCustomPrint', e.target.value)}
              className="w-full bg-[#faf8f5] border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl p-3 text-xs text-[#142319] outline-hidden font-mono leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* PREVIEW DRAWER */}
      <ModulePreviewDrawer
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="WhatsApp Message Simulation"
      >
        <div className="p-6 bg-[#faf8f5] flex items-center justify-center min-h-[350px]">
          {/* Chat bubble */}
          <div className="bg-white rounded-2xl p-5 shadow-lg max-w-sm w-full border border-[#ded7cb] relative">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-[#ebe5da] text-xs">
              <span className="font-bold text-[#142319]">Varna Concierge</span>
              <span className="text-[10px] text-[#6b7770] font-mono">• +{wa.phoneNumber}</span>
            </div>
            <pre className="text-xs text-[#142319] font-sans whitespace-pre-wrap leading-relaxed">
              {simulatedMessage}
            </pre>
            <span className="text-[9px] text-[#8c978f] block text-right mt-2 font-medium">
              Just now • Pre-filled on customer tap
            </span>
          </div>
        </div>
      </ModulePreviewDrawer>
    </div>
  )
}
