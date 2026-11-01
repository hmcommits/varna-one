import React from 'react'

export default function AdminLoginLoading() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center p-4 text-[#142319]">
      <div className="bg-white border border-[#ebe5da] rounded-3xl p-8 shadow-xl max-w-sm w-full text-center flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border-3 border-[#1c3624] border-t-transparent animate-spin mb-4" />
        <h3 className="font-display text-lg font-bold text-[#142319]">
          Command Vault Security
        </h3>
        <p className="text-[11px] text-[#6b7770] mt-1 font-mono uppercase tracking-wider">
          Initializing Authenticator...
        </p>
      </div>
    </div>
  )
}
