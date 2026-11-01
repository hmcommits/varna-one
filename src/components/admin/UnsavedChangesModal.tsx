'use client'
import React from 'react'
import { AlertTriangle, X, Check, Trash2 } from 'lucide-react'

interface UnsavedChangesModalProps {
  isOpen: boolean
  moduleName: string
  onStay: () => void
  onDiscard: () => void
  onSaveAndContinue: () => void
  isSaving?: boolean
}

export default function UnsavedChangesModal({
  isOpen,
  moduleName,
  onStay,
  onDiscard,
  onSaveAndContinue,
  isSaving,
}: UnsavedChangesModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-[#111a13] border border-[#c4a675]/50 rounded-3xl max-w-md w-full p-6 shadow-2xl relative text-[#f4efe6]">
        {/* Close icon */}
        <button
          type="button"
          onClick={onStay}
          className="absolute top-4 right-4 text-[#a89d8f] hover:text-white p-1 rounded-full transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Warning Icon & Heading */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-[#f4efe6]">
              Unsaved Changes Detected
            </h3>
            <p className="text-xs text-[#c4a675]">Draft changes in {moduleName}</p>
          </div>
        </div>

        {/* Message */}
        <p className="text-xs text-[#a89d8f] leading-relaxed mb-6">
          You have modified settings in <strong className="text-white">{moduleName}</strong> that have not been saved. If you leave without saving, these staging edits will be discarded.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <button
            type="button"
            onClick={onDiscard}
            className="w-full sm:w-auto flex-1 py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 size={13} />
            <span>Discard Changes</span>
          </button>

          <button
            type="button"
            onClick={onStay}
            className="w-full sm:w-auto py-2.5 px-3.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#a89d8f] hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Stay Here
          </button>

          <button
            type="button"
            onClick={onSaveAndContinue}
            disabled={isSaving}
            className="w-full sm:w-auto flex-1 py-2.5 px-3.5 rounded-xl bg-[#25D366] hover:bg-[#1fb355] text-black font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            <Check size={14} />
            <span>{isSaving ? 'Saving...' : 'Save & Continue'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
