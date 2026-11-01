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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111a13] border border-[#c4a675]/30 rounded-3xl p-5">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#c4a675] font-mono">
            GLOBAL CONFIGURATION
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#f4efe6]">
            Store Identity &amp; Logo Manager
          </h2>
          <p className="text-xs text-[#a89d8f] mt-0.5">
            Manage your brand logo, name, tagline, studio contact, and vault security passcode
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#f4efe6] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Eye size={14} className="text-[#c4a675]" />
          <span>Preview Brand Identity</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* LOGO MANAGER */}
        <div className="bg-[#111a13] border border-[#c4a675]/30 rounded-3xl p-5 sm:p-6 space-y-4">
          <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
            <Sparkles size={16} className="text-[#c4a675]" />
            <span>Store Logo Emblem</span>
          </h3>

          <div className="flex items-center gap-4 bg-[#0b120c] p-4 rounded-2xl border border-white/10">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full p-2 bg-[#1a2e1a] border border-[#c4a675]/40 flex-shrink-0">
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
              <label className="inline-flex items-center gap-1.5 py-2 px-3.5 bg-[#c4a675] hover:bg-[#b59560] text-black font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer">
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
              <p className="text-[10px] text-[#a89d8f]">
                Upload PNG, JPG, or SVG. Auto-converts to WebP.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
              Logo Image Path / CDN URL
            </label>
            <input
              type="text"
              value={settings.logoUrl}
              onChange={(e) => handleUpdate('logoUrl', e.target.value)}
              className="w-full bg-[#0b120c] border border-white/10 focus:border-[#c4a675] rounded-xl px-3 py-2 text-xs text-white outline-none font-mono"
            />
          </div>
        </div>

        {/* VAULT SECURITY PASSCODE */}
        <div className="bg-[#111a13] border border-[#c4a675]/30 rounded-3xl p-5 sm:p-6 space-y-4">
          <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
            <KeyRound size={16} className="text-[#c4a675]" />
            <span>Vault Security Passcode</span>
          </h3>

          <p className="text-xs text-[#a89d8f]">
            The passcode required to unlock the Admin Panel via the 5-tap logo emblem shortcut.
          </p>

          <div>
            <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
              Admin Passcode
            </label>
            <input
              type="text"
              value={settings.passcode}
              onChange={(e) => handleUpdate('passcode', e.target.value)}
              placeholder="e.g. varna2026"
              className="w-full bg-[#0b120c] border border-white/10 focus:border-[#c4a675] rounded-xl px-3.5 py-2.5 text-sm text-white font-mono font-bold outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-[#a89d8f] flex items-center gap-2">
            <Shield size={14} className="text-[#25D366]" />
            <span>Default passcode is <strong>varna2026</strong>. You can change it anytime.</span>
          </div>
        </div>
      </div>

      {/* Brand Identity Fields */}
      <div className="bg-[#111a13] border border-[#c4a675]/30 rounded-3xl p-5 sm:p-6 space-y-4">
        <h3 className="font-display text-base font-bold text-white">
          Brand Identity &amp; Contact Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
              Store Name
            </label>
            <input
              type="text"
              value={settings.storeName}
              onChange={(e) => handleUpdate('storeName', e.target.value)}
              className="w-full bg-[#0b120c] border border-white/10 focus:border-[#c4a675] rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={settings.subtitle}
              onChange={(e) => handleUpdate('subtitle', e.target.value)}
              className="w-full bg-[#0b120c] border border-white/10 focus:border-[#c4a675] rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
              Slogan / Tagline
            </label>
            <input
              type="text"
              value={settings.slogan}
              onChange={(e) => handleUpdate('slogan', e.target.value)}
              className="w-full bg-[#0b120c] border border-white/10 focus:border-[#c4a675] rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
              Support Phone
            </label>
            <input
              type="text"
              value={settings.supportPhone}
              onChange={(e) => handleUpdate('supportPhone', e.target.value)}
              className="w-full bg-[#0b120c] border border-white/10 focus:border-[#c4a675] rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
              Studio Address
            </label>
            <input
              type="text"
              value={settings.studioAddress}
              onChange={(e) => handleUpdate('studioAddress', e.target.value)}
              className="w-full bg-[#0b120c] border border-white/10 focus:border-[#c4a675] rounded-xl px-3 py-2 text-xs text-white outline-none"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
              Footer Copyright Notice
            </label>
            <input
              type="text"
              value={settings.copyrightText}
              onChange={(e) => handleUpdate('copyrightText', e.target.value)}
              className="w-full bg-[#0b120c] border border-white/10 focus:border-[#c4a675] rounded-xl px-3 py-2 text-xs text-white outline-none"
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
        <div className="p-6 bg-white flex items-center justify-center">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#faf8f4] border border-[#e8d5b7]">
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
              <span className="font-display italic text-2xl font-bold text-[#1a2e1a]">
                {settings.storeName}
              </span>
              <span className="block text-[10px] uppercase font-semibold text-[#7d7062] tracking-wider">
                {settings.subtitle} • {settings.slogan}
              </span>
            </div>
          </div>
        </div>
      </ModulePreviewDrawer>
    </div>
  )
}
