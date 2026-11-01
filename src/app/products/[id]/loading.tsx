import React from 'react'

export default function ProductDetailsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Gallery Skeleton */}
        <div className="space-y-4">
          <div className="w-full aspect-[4/5] rounded-3xl bg-[#ece6dc] shadow-xs" />
          <div className="grid grid-cols-3 gap-3">
            <div className="aspect-square rounded-2xl bg-[#ece6dc]" />
            <div className="aspect-square rounded-2xl bg-[#ece6dc]" />
            <div className="aspect-square rounded-2xl bg-[#ece6dc]" />
          </div>
        </div>

        {/* Right: Details Skeleton */}
        <div className="space-y-5">
          <div className="w-24 h-5 rounded-full bg-[#e5decf]" />
          <div className="w-3/4 h-8 rounded-xl bg-[#ece6dc]" />
          <div className="w-32 h-6 rounded-xl bg-[#ece6dc]" />

          {/* Color swatches skeleton */}
          <div className="pt-4 space-y-2">
            <div className="w-20 h-4 rounded-md bg-[#e5decf]" />
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-[#ece6dc]" />
              <div className="w-8 h-8 rounded-full bg-[#ece6dc]" />
              <div className="w-8 h-8 rounded-full bg-[#ece6dc]" />
            </div>
          </div>

          {/* Size picker skeleton */}
          <div className="pt-2 space-y-2">
            <div className="w-24 h-4 rounded-md bg-[#e5decf]" />
            <div className="flex gap-2">
              <div className="w-12 h-9 rounded-xl bg-[#ece6dc]" />
              <div className="w-12 h-9 rounded-xl bg-[#ece6dc]" />
              <div className="w-12 h-9 rounded-xl bg-[#ece6dc]" />
            </div>
          </div>

          {/* Button skeleton */}
          <div className="pt-4 space-y-3">
            <div className="w-full h-12 rounded-2xl bg-[#1c3624]/20" />
            <div className="w-full h-12 rounded-2xl bg-[#ece6dc]" />
          </div>
        </div>
      </div>
    </div>
  )
}
