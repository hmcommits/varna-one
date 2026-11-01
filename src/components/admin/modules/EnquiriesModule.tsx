'use client'
import React from 'react'
import { useStore } from '@/context/StoreContext'
import {
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react'

export default function EnquiriesModule() {
  const { draft, updateDraft } = useStore()
  const enquiries = draft.enquiries || []

  // Toggle Completed status
  const handleToggleCompleted = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      enquiries: (prev.enquiries || []).map((e) =>
        e.id === id ? { ...e, completed: !e.completed } : e
      ),
    }))
  }

  // Remove enquiry
  const handleRemove = (id: string) => {
    if (confirm('Are you sure you want to remove this enquiry?')) {
      updateDraft((prev) => ({
        ...prev,
        enquiries: (prev.enquiries || []).filter((e) => e.id !== id),
      }))
    }
  }

  // Export to CSV
  const handleExportCSV = () => {
    if (enquiries.length === 0) {
      alert('No enquiries to export.')
      return
    }

    const headers = ['ID', 'Date/Time', 'Product', 'Color', 'Size', 'Qty', 'Custom Notes', 'Source', 'Status']
    const rows = enquiries.map((e) => [
      e.id,
      `"${e.timestamp}"`,
      `"${e.productName}"`,
      `"${e.color}"`,
      `"${e.size}"`,
      e.quantity,
      `"${e.customNotes || ''}"`,
      `"${e.source}"`,
      e.completed ? 'Completed' : 'Active',
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `varna_enquiries_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Simulate test lead
  const handleSimulateLead = () => {
    const testItems = [
      'Premium Pure Linen Casual Shirt',
      'Floral Maxi Dress',
      'Striped Jersey Tee',
      'Printed Co-ord Set',
    ]
    const randomItem = testItems[Math.floor(Math.random() * testItems.length)]

    const newEnq = {
      id: `enq-${Date.now()}`,
      timestamp: 'Just now',
      productName: randomItem,
      color: 'Sample Shade',
      size: 'L (42")',
      quantity: 1,
      customNotes: 'Interested in bespoke monogram initials',
      source: 'Product Details Page' as const,
      completed: false,
    }

    updateDraft((prev) => ({
      ...prev,
      enquiries: [newEnq, ...(prev.enquiries || [])],
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111a13] border border-[#c4a675]/30 rounded-3xl p-5">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#c4a675] font-mono">
            CONCIERGE ACTIVITY TRACKER
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#f4efe6]">
            WhatsApp Enquiries &amp; Customer Leads
          </h2>
          <p className="text-xs text-[#a89d8f] mt-0.5">
            Real-time activity log tracking customer clicks on order and enquiry buttons
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleSimulateLead}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#f4efe6] transition-colors cursor-pointer"
            title="Create a sample enquiry for testing"
          >
            <Sparkles size={13} className="text-[#c4a675]" />
            <span>Simulate Lead</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c4a675] hover:bg-[#b59560] text-black font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Download size={14} />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Enquiries Stream Table */}
      <div className="bg-[#111a13] border border-[#c4a675]/30 rounded-3xl overflow-hidden shadow-xl">
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#e8d5b7]">
            All Leads ({enquiries.length} total)
          </span>
          <span className="text-xs text-[#a89d8f]">
            {enquiries.filter((e) => !e.completed).length} active inquiries pending follow-up
          </span>
        </div>

        {enquiries.length === 0 ? (
          <div className="p-10 text-center text-xs text-[#a89d8f]">
            No customer inquiries recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b120c] text-[#a89d8f] uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Variant &amp; Quantity</th>
                  <th className="py-3 px-4">Time &amp; Source</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[#f4efe6]">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-white/5 transition-colors">
                    {/* Product & Custom Notes */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-white block text-sm">
                        {enq.productName}
                      </span>
                      {enq.customNotes ? (
                        <span className="text-[11px] text-[#c4a675] block mt-0.5">
                          Custom Note: &ldquo;{enq.customNotes}&rdquo;
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#7d7062]">Standard Fit</span>
                      )}
                    </td>

                    {/* Variant */}
                    <td className="py-3 px-4 text-[#a89d8f]">
                      <span className="block font-medium text-white">{enq.color}</span>
                      <span className="text-[11px]">
                        Size: {enq.size} • Qty: <strong>{enq.quantity}</strong>
                      </span>
                    </td>

                    {/* Time & Source */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-white text-[11px]">
                        <Clock size={11} className="text-[#c4a675]" />
                        <span>{enq.timestamp}</span>
                      </div>
                      <span className="text-[10px] text-[#7d7062] block mt-0.5">
                        {enq.source}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      {enq.completed ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-[#25D366]/20 text-[#25D366] px-2.5 py-1 rounded-full font-bold">
                          <CheckCircle2 size={11} /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full font-bold">
                          Active Lead
                        </span>
                      )}
                    </td>

                    {/* Direct Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Mark as Completed */}
                        <button
                          type="button"
                          onClick={() => handleToggleCompleted(enq.id)}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                            enq.completed
                              ? 'bg-white/5 hover:bg-white/10 text-[#a89d8f]'
                              : 'bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366]'
                          }`}
                        >
                          <Check size={12} />
                          <span>{enq.completed ? 'Reopen' : 'Mark as Completed'}</span>
                        </button>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => handleRemove(enq.id)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                          title="Remove Enquiry"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
