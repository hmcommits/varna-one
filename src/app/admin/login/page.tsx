'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useStore } from '@/context/StoreContext'
import { Lock, ArrowRight, ShieldCheck, ArrowLeft, KeyRound } from 'lucide-react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const router = useRouter()
  const { store } = useStore()
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  const masterPasscode = store.settings?.passcode || 'varna2026'

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)

    setTimeout(() => {
      if (passcode.trim() === masterPasscode) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('varna_admin_session', 'true')
          localStorage.setItem('varna_admin_authenticated', 'true')
        }
        router.push('/admin')
      } else {
        setError(true)
        setLoading(false)
      }
    }, 400)
  }

  const handleQuickDemoFill = () => {
    setPasscode(masterPasscode)
    setError(false)
  }

  const logoSrc =
    store.settings?.logoUrl ||
    'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532654/varna_store/logo/varna-emblem.webp'

  return (
    <div className="min-h-screen bg-[#0b120c] text-[#f4efe6] flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden selection:bg-[#c4a675] selection:text-black">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#1a2e1a]/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#c4a675]/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Bar */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between z-10">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-[#a89d8f] hover:text-[#e8d5b7] transition-colors font-medium py-2"
        >
          <ArrowLeft size={14} />
          <span>Back to Storefront</span>
        </Link>
        <span className="text-[10px] tracking-widest uppercase text-[#c4a675] font-mono bg-white/5 border border-[#c4a675]/20 px-2.5 py-1 rounded-full">
          Single Entrypoint Authenticator
        </span>
      </div>

      {/* Centered Login Card */}
      <div className="max-w-md w-full mx-auto my-auto z-10">
        <div className="bg-[#111a13]/90 border border-[#c4a675]/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {/* Logo & Header */}
          <div className="text-center mb-6">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full p-2 bg-gradient-to-b from-[#1a2e1a] to-[#0b120c] border border-[#c4a675]/40 shadow-[0_0_25px_rgba(196,166,117,0.2)]">
              <Image
                src={logoSrc}
                alt="Varna"
                fill
                className="object-contain p-2"
                priority
              />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#f4efe6] tracking-tight">
              Varna Command Vault
            </h1>
            <p className="text-xs text-[#a89d8f] mt-1">
              Authorized Personnel Storefront Management
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#e8d5b7] mb-1.5 uppercase tracking-wider">
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
                  className={`w-full bg-[#0b120c] border rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-[#685e52] focus:outline-none transition-all ${
                    error
                      ? 'border-red-500 ring-2 ring-red-500/20'
                      : 'border-[#c4a675]/40 focus:border-[#c4a675] focus:ring-2 focus:ring-[#c4a675]/20'
                  }`}
                />
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#c4a675]"
                />
              </div>
              {error && (
                <p className="text-xs text-red-400 mt-1.5 font-medium flex items-center gap-1">
                  <span>Invalid passcode. Please verify or use demo fill below.</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#1a2e1a] via-[#244224] to-[#1a2e1a] hover:from-[#244224] hover:to-[#2e542e] border border-[#c4a675]/50 text-[#e8d5b7] hover:text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Unlock Command Vault'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* Demo Quick Fill Helper */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
            <span className="text-[#a89d8f]">Demo Evaluation?</span>
            <button
              type="button"
              onClick={handleQuickDemoFill}
              className="text-[#c4a675] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <KeyRound size={12} />
              <span>Quick Demo Fill ({masterPasscode})</span>
            </button>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="text-center mt-6 flex items-center justify-center gap-1.5 text-[11px] text-[#7d7062]">
          <ShieldCheck size={14} className="text-[#25D366]" />
          <span>Varna Direct WhatsApp Concierge Architecture • Next.js 14</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full text-center text-[10px] text-[#554c41] py-2 z-10 font-mono">
        VARNA PROTOCOL SECURE ENCLAVE
      </div>
    </div>
  )
}
