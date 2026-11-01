'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useStore } from '@/context/StoreContext'
import { StoreSettings } from '@/types/store'
import { Upload, Eye, KeyRound, Sparkles, Shield } from 'lucide-react'
import ModulePreviewDrawer from '../ModulePreviewDrawer'

export default function SettingsModule() {
  const { draft, updateDraft } = useStore()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)

  const settings = draft.settings || {
    storeName: 'Varna',
    subtitle: 'Custom Wear & Prints',
    slogan: 'Wear Your Colors',
    supportPhone: '+91 6363145972',
    studioAddress: 'Indiranagar 100ft Road, Bengaluru, Karnataka 560038',
    copyrightText: '© 2026 Varna. All rights reserved.',
    logoUrl:
      'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532654/varna_store/logo/varna-emblem.webp',
    passcode: 'varna2026',
    storeStatus: 'Online',
  }

  const handleUpdate = (field: keyof StoreSettings, val: any) => {
    updateDraft((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: val,
      },
    }))
  }

  // Upload Logo file via API
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingLogo(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        const data = await res.json()
        handleUpdate('logoUrl', data.url)
      }
    } catch (err) {
      console.error('Logo upload failed:', err)
      alert('Logo upload failed.')
    } finally {
      setUploadingLogo(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#ebe5da] rounded-3xl p-6 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#845d1d] font-mono">
            GLOBAL CONFIGURATION
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#142319] mt-0.5">
            Store Identity &amp; Logo Manager
          </h2>
          <p className="text-xs text-[#6b7770] mt-0.5">
            Manage your brand logo, name, tagline, studio contact, and vault security passcode
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#faf6f0] hover:bg-[#f0ece4] border border-[#ded7cb] text-xs font-semibold text-[#142319] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Eye size={14} className="text-[#845d1d]" />
          <span>Preview Brand Identity</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* LOGO MANAGER */}
        <div className="bg-white border border-[#ebe5da] rounded-3xl p-6 space-y-4 shadow-2xs">
          <h3 className="font-display text-base font-bold text-[#142319] flex items-center gap-2">
            <Sparkles size={16} className="text-[#845d1d]" />
            <span>Store Logo Emblem</span>
          </h3>

          <div className="flex items-center gap-4 bg-[#faf8f5] p-4 rounded-2xl border border-[#ded7cb]">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-2 bg-[#1c3624] border border-[#ded7cb] flex-shrink-0 shadow-2xs">
              <Image
                src={
                  settings.logoUrl ||
                  'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532654/varna_store/logo/varna-emblem.webp'
                }
                alt={settings.storeName}
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="space-y-2 flex-1">
              <label className="inline-flex items-center gap-1.5 py-2 px-3.5 bg-[#1c3624] hover:bg-[#14281a] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer">
                <Upload size={13} />
                <span>{uploadingLogo ? 'Converting...' : 'Upload New Logo'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  disabled={uploadingLogo}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-[#6b7770]">
                Upload PNG, JPG, or SVG. Auto-converts to WebP.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#142319] mb-1">
              Logo Image Path / CDN URL
            </label>
            <input
              type="text"
              value={settings.logoUrl}
              onChange={(e) => handleUpdate('logoUrl', e.target.value)}
              className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl px-3 py-2 text-xs text-[#142319] outline-hidden font-mono"
            />
          </div>
        </div>

        {/* VAULT SECURITY PASSCODE */}
        <div className="bg-white border border-[#ebe5da] rounded-3xl p-6 space-y-4 shadow-2xs">
          <h3 className="font-display text-base font-bold text-[#142319] flex items-center gap-2">
            <KeyRound size={16} className="text-[#845d1d]" />
            <span>Vault Security Passcode</span>
          </h3>

          <p className="text-xs text-[#6b7770]">
            The passcode required to unlock the Admin Panel via the 5-tap logo emblem shortcut.
          </p>

          <div>
            <label className="block text-xs font-semibold text-[#142319] mb-1">
              Admin Passcode
            </label>
            <input
              type="text"
              value={settings.passcode}
              onChange={(e) => handleUpdate('passcode', e.target.value)}
              placeholder="e.g. varna2026"
              className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl px-3.5 py-2.5 text-sm text-[#142319] font-mono font-bold outline-hidden"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#ded7cb] text-[11px] text-[#6b7770] flex items-center gap-2 font-medium">
            <Shield size={14} className="text-[#206035]" />
            <span>Default passcode is <strong className="text-[#142319]">varna2026</strong>. You can change it anytime.</span>
          </div>
        </div>
      </div>

      {/* Brand Identity Fields */}
      <div className="bg-white border border-[#ebe5da] rounded-3xl p-6 space-y-4 shadow-2xs">
        <h3 className="font-display text-base font-bold text-[#142319]">
          Brand Identity &amp; Contact Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#142319] mb-1">
              Store Name
            </label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(e) => handleUpdate('storeName', e.target.value)}
              className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] rounded-xl px-3 py-2 text-xs text-[#142319] outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#142319] mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={settings.subtitle}
              onChange={(e) => handleUpdate('subtitle', e.target.value)}
              className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] rounded-xl px-3 py-2 text-xs text-[#142319] outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#142319] mb-1">
              Slogan / Tagline
            </label>
            <input
              type="text"
              value={settings.slogan}
              onChange={(e) => handleUpdate('slogan', e.target.value)}
              className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] rounded-xl px-3 py-2 text-xs text-[#142319] outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#142319] mb-1">
              Support Phone
            </label>
            <input
              type="text"
              value={settings.supportPhone}
              onChange={(e) => handleUpdate('supportPhone', e.target.value)}
              className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] rounded-xl px-3 py-2 text-xs text-[#142319] outline-hidden"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#142319] mb-1">
              Studio Address
            </label>
            <input
              type="text"
              value={settings.studioAddress}
              onChange={(e) => handleUpdate('studioAddress', e.target.value)}
              className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] rounded-xl px-3 py-2 text-xs text-[#142319] outline-hidden"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-[#142319] mb-1">
              Footer Copyright Notice
            </label>
            <input
              type="text"
              value={settings.copyrightText}
              onChange={(e) => handleUpdate('copyrightText', e.target.value)}
              className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] rounded-xl px-3 py-2 text-xs text-[#142319] outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* PREVIEW DRAWER */}
      <ModulePreviewDrawer
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Brand Identity & Navbar Preview"
      >
        <div className="p-6 bg-[#faf8f5] flex items-center justify-center">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-[#ded7cb] shadow-xs">
            <div className="relative w-12 h-12">
              <Image
                src={
                  settings.logoUrl ||
                  'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532654/varna_store/logo/varna-emblem.webp'
                }
                alt={settings.storeName}
                fill
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-display italic text-2xl font-bold text-[#142319]">
                {settings.storeName}
              </span>
              <span className="block text-[10px] uppercase font-semibold text-[#6b7770] tracking-wider">
                {settings.subtitle} • {settings.slogan}
              </span>
            </div>
          </div>
        </div>
      </ModulePreviewDrawer>
    </div>
  )
}
