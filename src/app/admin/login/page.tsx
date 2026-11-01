'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useStore } from '@/context/StoreContext'
import { Lock, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const { store } = useStore()
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  // Prefetch admin dashboard immediately so entry is instantaneous
  React.useEffect(() => {
    router.prefetch('/admin')
  }, [router])

  const masterPasscode = store.settings?.passcode || 'varna2026'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)

    if (passcode.trim() === masterPasscode) {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('varna_admin_session', 'true')
        sessionStorage.setItem('varna_admin_token', passcode.trim())
        localStorage.setItem('varna_admin_authenticated', 'true')
      }
      router.push('/admin')
    } else {
      setError(true)
      setLoading(false)
    }
  }

  const logoSrc =
    store.settings?.logoUrl ||
    'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532654/varna_store/logo/varna-emblem.webp'

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#142319] flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#eef7f0]/80 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#fcf5e9]/90 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between z-10">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-[#6b7770] hover:text-[#142319] transition-colors font-medium py-2"
        >
          <ArrowLeft size={14} />
          <span>Back to Storefront</span>
        </Link>
        <span className="text-[10px] tracking-widest uppercase text-[#845d1d] font-mono bg-white border border-[#ded7cb] px-3 py-1 rounded-full shadow-2xs font-bold">
          Single Entrypoint Authenticator
        </span>
      </div>

      {/* Centered Login Card */}
      <div className="max-w-md w-full mx-auto my-auto z-10">
        <div className="bg-white border border-[#ebe5da] rounded-3xl p-6 sm:p-8 shadow-xl">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full p-2 bg-[#1c3624] border border-[#ded7cb] shadow-xs">
              <Image
                src={logoSrc}
                alt="Varna"
                fill
                className="object-contain p-2"
                priority
              />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#142319] tracking-tight">
              Varna Command Vault
            </h1>
            <p className="text-xs text-[#6b7770] mt-1">
              Authorized Personnel Storefront Management
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#142319] mb-1.5 uppercase tracking-wider">
                Master Security Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => {
                    setPasscode(e.target.value)
                    setError(false)
                  }}
                  placeholder="Enter vault passcode..."
                  autoFocus
                  required
                  className={`w-full bg-white border rounded-xl py-3 pl-10 pr-4 text-sm text-[#142319] placeholder-[#8c978f] focus:outline-hidden transition-all ${
                    error
                      ? 'border-red-500 ring-2 ring-red-500/20'
                      : 'border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624]'
                  }`}
                />
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#845d1d]"
                />
              </div>
              {error && (
                <p className="text-xs text-[#b84840] mt-1.5 font-medium flex items-center gap-1">
                  <span>Invalid passcode. Please verify or use demo fill below.</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1c3624] hover:bg-[#14281a] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Unlock Command Vault'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        </div>

        {/* Security badge footer */}
        <div className="text-center mt-6 flex items-center justify-center gap-1.5 text-[11px] text-[#6b7770]">
          <ShieldCheck size={14} className="text-[#206035]" />
          <span>Varna Direct WhatsApp Concierge Architecture • Next.js 14</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full text-center text-[10px] text-[#8c978f] py-2 z-10 font-mono">
        VARNA PROTOCOL SECURE ENCLAVE
      </div>
    </div>
  )
}
