import React from 'react'

export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-4 text-[#142319]">
      <div className="relative w-14 h-14 mb-4">
        <div className="absolute inset-0 rounded-full border-3 border-[#ded7cb] opacity-50" />
        <div className="absolute inset-0 rounded-full border-3 border-[#1c3624] border-t-transparent animate-spin" />
      </div>
      <h2 className="font-display text-base font-bold text-[#142319] tracking-tight">
        Loading Varna Admin...
      </h2>
      <p className="text-xs text-[#6b7770] mt-1 font-mono uppercase tracking-widest text-[10px]">
        Synchronizing live inventory &amp; settings
      </p>
    </div>
  )
}
