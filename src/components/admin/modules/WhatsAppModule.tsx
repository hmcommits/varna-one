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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111a13] border border-[#c4a675]/30 rounded-3xl p-5">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#c4a675] font-mono">
            CONCIERGE &amp; SALES FUNNEL
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#f4efe6]">
            WhatsApp Concierge Manager
          </h2>
          <p className="text-xs text-[#a89d8f] mt-0.5">
            Configure phone routing, live message templates with dynamic auto-fill variables, and floating button glow
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#f4efe6] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Eye size={14} className="text-[#c4a675]" />
          <span>Preview Chat Simulation</span>
        </button>
      </div>

      {/* Main Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Phone & Routing */}
        <div className="bg-[#111a13] border border-[#c4a675]/30 rounded-3xl p-5 space-y-4">
          <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
            <Phone size={16} className="text-[#25D366]" />
            <span>Target WhatsApp Business Number</span>
          </h3>

          <div>
            <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
              Phone Number (with Country Code, no + or spaces)
            </label>
            <input
              type="text"
              value={wa.phoneNumber}
              onChange={(e) => handleUpdate('phoneNumber', e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="916363145972"
              className="w-full bg-[#0b120c] border border-white/10 focus:border-[#25D366] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono font-bold outline-none"
            />
            <p className="text-[11px] text-[#7d7062] mt-1">
              Formatted for direct WhatsApp click-to-chat links: <span className="text-[#25D366]">wa.me/{wa.phoneNumber}</span>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
              Operating Hours / Availability Note
            </label>
            <input
              type="text"
              value={wa.hoursNote}
              onChange={(e) => handleUpdate('hoursNote', e.target.value)}
              placeholder="e.g., Online 10 AM – 9 PM daily (Typical reply: < 5 mins)"
              className="w-full bg-[#0b120c] border border-white/10 focus:border-[#c4a675] rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>
        </div>

        {/* Floating Concierge Button Appearance */}
        <div className="bg-[#111a13] border border-[#c4a675]/30 rounded-3xl p-5 space-y-4">
          <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
            <Sparkles size={16} className="text-[#c4a675]" />
            <span>Floating Concierge Button Tuning</span>
          </h3>

          <div className="space-y-3 bg-[#0b120c] p-3.5 rounded-2xl border border-white/10">
            <label className="flex items-center justify-between text-xs cursor-pointer">
              <span className="font-semibold text-white">Show Floating WhatsApp Button</span>
              <input
                type="checkbox"
                checked={wa.floatingButtonVisible}
                onChange={(e) => handleUpdate('floatingButtonVisible', e.target.checked)}
                className="w-4 h-4 rounded text-[#25D366] focus:ring-[#25D366]"
              />
            </label>

            <label className="flex items-center justify-between text-xs cursor-pointer pt-2 border-t border-white/10">
              <div>
                <span className="font-semibold text-white block">Luminous Breathing Glow Aura</span>
                <span className="text-[10px] text-[#a89d8f]">Gentle ambient pulse animation on bottom-right</span>
              </div>
              <input
                type="checkbox"
                checked={wa.luminousGlow}
                onChange={(e) => handleUpdate('luminousGlow', e.target.checked)}
                className="w-4 h-4 rounded text-[#25D366] focus:ring-[#25D366]"
              />
            </label>

            <div className="pt-2 border-t border-white/10">
              <label className="block text-[11px] font-semibold text-[#e8d5b7] mb-1">
                Button Label Text
              </label>
              <input
                type="text"
                value={wa.floatingButtonText}
                onChange={(e) => handleUpdate('floatingButtonText', e.target.value)}
                placeholder="Enquire, Chat, Order on WhatsApp"
                className="w-full bg-[#111a13] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Message Templates */}
      <div className="bg-[#111a13] border border-[#c4a675]/30 rounded-3xl p-5 sm:p-6 space-y-5">
        <div>
          <h3 className="font-display text-base font-bold text-white">
            Dynamic Message Templates
          </h3>
          <p className="text-xs text-[#a89d8f]">
            These templates pre-fill when customer clicks a WhatsApp button. Supported placeholders: <code className="text-[#c4a675]">&#123;product_name&#125;</code>, <code className="text-[#c4a675]">&#123;color&#125;</code>, <code className="text-[#c4a675]">&#123;size&#125;</code>, <code className="text-[#c4a675]">&#123;quantity&#125;</code>, <code className="text-[#c4a675]">&#123;price&#125;</code>, <code className="text-[#c4a675]">&#123;custom_notes&#125;</code>.
          </p>
        </div>

        <div className="space-y-4">
          {/* Template 1: PDP Order */}
          <div>
            <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
              1. Product Details Page (PDP) Order Template
            </label>
            <textarea
              rows={4}
              value={wa.templatePdp}
              onChange={(e) => handleUpdate('templatePdp', e.target.value)}
              className="w-full bg-[#0b120c] border border-white/10 focus:border-[#25D366] rounded-xl p-3 text-xs text-white outline-none font-mono leading-relaxed"
            />
          </div>

          {/* Template 2: Product Card Quick Enquiry */}
          <div>
            <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
              2. Product Card Quick Enquiry Template
            </label>
            <textarea
              rows={2}
              value={wa.templateCard}
              onChange={(e) => handleUpdate('templateCard', e.target.value)}
              className="w-full bg-[#0b120c] border border-white/10 focus:border-[#25D366] rounded-xl p-3 text-xs text-white outline-none font-mono leading-relaxed"
            />
          </div>

          {/* Template 3: General Store Enquiry */}
          <div>
            <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
              3. General Store &amp; Navbar Enquiry Template
            </label>
            <textarea
              rows={2}
              value={wa.templateGeneral}
              onChange={(e) => handleUpdate('templateGeneral', e.target.value)}
              className="w-full bg-[#0b120c] border border-white/10 focus:border-[#25D366] rounded-xl p-3 text-xs text-white outline-none font-mono leading-relaxed"
            />
          </div>

          {/* Template 4: Bulk Custom Prints */}
          <div>
            <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
              4. Bulk / Team Custom Printing Enquiry Template
            </label>
            <textarea
              rows={2}
              value={wa.templateCustomPrint}
              onChange={(e) => handleUpdate('templateCustomPrint', e.target.value)}
              className="w-full bg-[#0b120c] border border-white/10 focus:border-[#25D366] rounded-xl p-3 text-xs text-white outline-none font-mono leading-relaxed"
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
        <div className="p-6 bg-[#efeae2] flex items-center justify-center min-h-[350px]">
          {/* Chat bubble */}
          <div className="bg-white rounded-2xl p-4 shadow-lg max-w-sm w-full border border-black/10 relative">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-black/10 text-xs">
              <span className="font-bold text-[#075e54]">Varna Concierge</span>
              <span className="text-[10px] text-[#7d7062]">• +{wa.phoneNumber}</span>
            </div>
            <pre className="text-xs text-[#111] font-sans whitespace-pre-wrap leading-relaxed">
              {simulatedMessage}
            </pre>
            <span className="text-[9px] text-[#7d7062] block text-right mt-2">
              Just now • Pre-filled on customer tap
            </span>
          </div>
        </div>
      </ModulePreviewDrawer>
    </div>
  )
}
