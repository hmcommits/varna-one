'use client'
import React from 'react'
import { useStore } from '@/context/StoreContext'
import {
  Download,
  Trash2,
  CheckCircle2,
  Clock,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#ebe5da] rounded-3xl p-6 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#845d1d] font-mono">
            CONCIERGE ACTIVITY TRACKER
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#142319] mt-0.5">
            WhatsApp Enquiries &amp; Customer Leads
          </h2>
          <p className="text-xs text-[#6b7770] mt-0.5">
            Real-time activity log tracking customer clicks on order and enquiry buttons
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1c3624] hover:bg-[#14281a] text-white font-bold text-xs shadow-xs transition-all active:scale-97 cursor-pointer"
          >
            <Download size={14} />
            <span>Export to CSV</span>
          </button>
        </div>
      </div>

      {/* Enquiries Stream Table */}
      <div className="bg-white border border-[#ebe5da] rounded-3xl overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-[#ebe5da] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#142319]">
            All Leads ({enquiries.length} total)
          </span>
          <span className="text-xs text-[#6b7770]">
            {enquiries.filter((e) => !e.completed).length} active inquiries pending follow-up
          </span>
        </div>

        {enquiries.length === 0 ? (
          <div className="p-10 text-center text-xs text-[#6b7770]">
            No customer inquiries recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf7f2] text-[#4a4740] uppercase text-[10px] tracking-wider border-b border-[#ebe5da] font-bold">
                <tr>
                  <th className="py-3 px-4">Product Details</th>
                  <th className="py-3 px-4">Variant &amp; Quantity</th>
                  <th className="py-3 px-4">Time &amp; Source</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebe5da] text-[#142319]">
                {enquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#faf8f4] transition-colors">
                    {/* Product & Custom Notes */}
                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#142319] block text-sm">
                        {enq.productName}
                      </span>
                      {enq.customNotes ? (
                        <span className="text-[11px] text-[#845d1d] block mt-0.5">
                          Custom Note: &ldquo;{enq.customNotes}&rdquo;
                        </span>
                      ) : (
                        <span className="text-[10px] text-[#8c978f]">Standard Fit</span>
                      )}
                    </td>

                    {/* Variant */}
                    <td className="py-3 px-4 text-[#556358]">
                      <span className="block font-medium text-[#142319]">{enq.color}</span>
                      <span className="text-[11px]">
                        Size: {enq.size} • Qty: <strong>{enq.quantity}</strong>
                      </span>
                    </td>

                    {/* Time & Source */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 text-[#142319] text-[11px]">
                        <Clock size={11} className="text-[#845d1d]" />
                        <span>{enq.timestamp}</span>
                      </div>
                      <span className="text-[10px] text-[#8c978f] block mt-0.5">
                        {enq.source}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">
                      {enq.completed ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-[#eaf6ec] text-[#246b38] border border-[#cbe8d1] px-2.5 py-0.5 rounded-full font-bold">
                          <CheckCircle2 size={11} /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-[#fef6e7] text-[#975a16] border border-[#fae4ba] px-2.5 py-0.5 rounded-full font-bold">
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
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border ${
                            enq.completed
                              ? 'bg-[#faf6f0] hover:bg-[#f0ece4] border-[#ded7cb] text-[#556358]'
                              : 'bg-[#eaf6ec] hover:bg-[#d9f0dd] text-[#246b38] border-[#cbe8d1]'
                          }`}
                        >
                          <Check size={12} />
                          <span>{enq.completed ? 'Reopen' : 'Mark as Completed'}</span>
                        </button>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => handleRemove(enq.id)}
                          className="p-1.5 rounded-lg bg-[#fdf0ef] hover:bg-[#fadcd9] text-[#b84840] border border-[#fcd8d5] transition-colors cursor-pointer"
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
