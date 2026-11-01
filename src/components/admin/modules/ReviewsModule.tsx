'use client'
import React, { useState } from 'react'
import { useStore } from '@/context/StoreContext'
import { ReviewItem } from '@/types/store'
import {
  Star,
  Plus,
  Trash2,
  Edit2,
  Eye,
  CheckCircle2,
  MapPin,
  Sparkles,
  X,
  Save,
} from 'lucide-react'
import ModulePreviewDrawer from '../ModulePreviewDrawer'

export default function ReviewsModule() {
  const { draft, updateDraft } = useStore()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<ReviewItem | null>(null)
  const [isNew, setIsNew] = useState(false)

  const reviewsData = draft.reviews || {
    averageRating: 4.6,
    totalReviewsCount: 120,
    items: [],
  }

  const handleUpdateSummary = (field: 'averageRating' | 'totalReviewsCount', val: number) => {
    updateDraft((prev) => ({
      ...prev,
      reviews: {
        ...prev.reviews,
        [field]: val,
      },
    }))
  }

  const handleOpenNew = () => {
    setEditingReview({
      id: `rev-${Date.now()}`,
      name: '',
      city: '',
      rating: 5,
      title: '',
      comment: '',
      verified: true,
      date: 'Verified Buyer • Just now',
    })
    setIsNew(true)
  }

  const handleSaveReview = () => {
    if (!editingReview) return
    if (!editingReview.name.trim() || !editingReview.comment.trim()) {
      alert('Please provide customer name and review comment')
      return
    }

    updateDraft((prev) => {
      const existing = prev.reviews?.items || []
      let updated: ReviewItem[]
      if (isNew) {
        updated = [editingReview, ...existing]
      } else {
        updated = existing.map((r) => (r.id === editingReview.id ? editingReview : r))
      }
      return {
        ...prev,
        reviews: {
          ...prev.reviews,
          items: updated,
        },
      }
    })

    setEditingReview(null)
    setIsNew(false)
  }

  const handleDeleteReview = (id: string) => {
    if (confirm('Delete this customer testimonial?')) {
      updateDraft((prev) => ({
        ...prev,
        reviews: {
          ...prev.reviews,
          items: (prev.reviews?.items || []).filter((r) => r.id !== id),
        },
      }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111a13] border border-[#c4a675]/30 rounded-3xl p-5">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#c4a675] font-mono">
            SOCIAL PROOF &amp; TESTIMONIALS
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#f4efe6]">
            Customer Reviews &amp; Ratings
          </h2>
          <p className="text-xs text-[#a89d8f] mt-0.5">
            Manage storefront buyer reviews, verified purchaser badges, and overall trust score summary
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#f4efe6] transition-colors cursor-pointer"
          >
            <Eye size={14} className="text-[#c4a675]" />
            <span>Preview Section</span>
          </button>
          <button
            type="button"
            onClick={handleOpenNew}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c4a675] hover:bg-[#d4b685] text-[#111a13] font-bold text-xs transition-colors cursor-pointer shadow-md"
          >
            <Plus size={14} />
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {/* Trust Score Summary Metrics Card */}
      <div className="bg-[#111a13] border border-[#c4a675]/30 rounded-3xl p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#c4a675] mb-3 flex items-center gap-2">
          <Sparkles size={14} />
          <span>Overall Storefront Rating Summary</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
              Average Rating Score (e.g. 4.6 out of 5)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={reviewsData.averageRating}
                onChange={(e) => handleUpdateSummary('averageRating', parseFloat(e.target.value) || 4.5)}
                className="w-32 bg-[#18241b] border border-white/15 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-[#c4a675] focus:outline-hidden"
              />
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    className={
                      s <= Math.round(reviewsData.averageRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-white/20'
                    }
                  />
                ))}
              </div>
            </div>
            <p className="text-[11px] text-[#a89d8f] mt-1">
              Displayed prominently across hero banner, category headers, and reviews section
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
              Total Verified Reviews Count (e.g. 120+)
            </label>
            <input
              type="number"
              min="0"
              value={reviewsData.totalReviewsCount}
              onChange={(e) => handleUpdateSummary('totalReviewsCount', parseInt(e.target.value) || 0)}
              className="w-full bg-[#18241b] border border-white/15 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-[#c4a675] focus:outline-hidden"
            />
            <p className="text-[11px] text-[#a89d8f] mt-1">
              Shown alongside &quot;Verified Customer Reviews&quot; header in the customer reviews strip
            </p>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#c4a675]">
            Featured Customer Testimonials ({reviewsData.items.length})
          </h3>
          <span className="text-[11px] text-[#a89d8f]">
            Reorder or edit to curate the best social proof
          </span>
        </div>

        {reviewsData.items.length === 0 ? (
          <div className="p-8 text-center bg-[#111a13] border border-white/10 rounded-3xl text-sm text-[#a89d8f]">
            No reviews added yet. Click &quot;Add Testimonial&quot; above to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reviewsData.items.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#111a13] border border-white/10 hover:border-[#c4a675]/40 rounded-3xl p-5 flex flex-col justify-between transition-all group relative"
              >
                <div>
                  {/* Top row: stars and verified badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={14}
                          className={s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-white/20'}
                        />
                      ))}
                    </div>

                    {rev.verified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        <CheckCircle2 size={11} />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>

                  {/* Title & Comment */}
                  <div className="space-y-1.5 mb-4">
                    <h4 className="font-display text-sm font-bold text-[#f4efe6] line-clamp-1">
                      &quot;{rev.title}&quot;
                    </h4>
                    <p className="text-xs text-[#dcd4c8] leading-relaxed line-clamp-4">
                      {rev.comment}
                    </p>
                  </div>
                </div>

                {/* Footer with Author Details & Actions */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-[#a89d8f]">
                  <div>
                    <p className="font-bold text-white text-xs">{rev.name}</p>
                    <p className="text-[11px] text-[#a89d8f] flex items-center gap-1">
                      <MapPin size={10} />
                      <span>{rev.city}</span>
                      <span>•</span>
                      <span>{rev.date}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingReview(rev)
                        setIsNew(false)
                      }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-[#f4efe6] cursor-pointer"
                      title="Edit review"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(rev.id)}
                      className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-800/40 cursor-pointer"
                      title="Delete review"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#111a13] border border-[#c4a675]/40 rounded-3xl max-w-lg w-full p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-display text-lg font-bold text-[#f4efe6]">
                {isNew ? 'Add Customer Testimonial' : 'Edit Testimonial'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={editingReview.name}
                    onChange={(e) => setEditingReview({ ...editingReview, name: e.target.value })}
                    placeholder="e.g. Arjun Menon"
                    className="w-full bg-[#18241b] border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:border-[#c4a675] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">City / Region</label>
                  <input
                    type="text"
                    value={editingReview.city}
                    onChange={(e) => setEditingReview({ ...editingReview, city: e.target.value })}
                    placeholder="e.g. Bengaluru"
                    className="w-full bg-[#18241b] border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:border-[#c4a675] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Star Rating Picker */}
              <div>
                <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEditingReview({ ...editingReview, rating: s })}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        size={22}
                        className={
                          s <= editingReview.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-white/25 hover:text-white/50'
                        }
                      />
                    </button>
                  ))}
                  <span className="text-xs text-[#a89d8f] font-mono ml-2">
                    {editingReview.rating} out of 5 stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">Headline / Title</label>
                <input
                  type="text"
                  value={editingReview.title}
                  onChange={(e) => setEditingReview({ ...editingReview, title: e.target.value })}
                  placeholder="e.g. Cloud-soft from day 1"
                  className="w-full bg-[#18241b] border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:border-[#c4a675] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">Review Body Comment</label>
                <textarea
                  rows={3}
                  value={editingReview.comment}
                  onChange={(e) => setEditingReview({ ...editingReview, comment: e.target.value })}
                  placeholder="Detailed customer experience..."
                  className="w-full bg-[#18241b] border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:border-[#c4a675] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 items-center">
                <div>
                  <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">Date Note</label>
                  <input
                    type="text"
                    value={editingReview.date}
                    onChange={(e) => setEditingReview({ ...editingReview, date: e.target.value })}
                    placeholder="e.g. Verified Buyer • 3 days ago"
                    className="w-full bg-[#18241b] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:border-[#c4a675] focus:outline-hidden"
                  />
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={editingReview.verified}
                      onChange={(e) =>
                        setEditingReview({ ...editingReview, verified: e.target.checked })
                      }
                      className="w-4 h-4 accent-[#25D366] rounded cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-[#e8d5b7]">
                      Verified Buyer Badge
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingReview(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#f4efe6] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveReview}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c4a675] hover:bg-[#d4b685] text-[#111a13] font-bold text-xs cursor-pointer shadow-md"
              >
                <Save size={14} />
                <span>Save Testimonial</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Module Preview Drawer */}
      <ModulePreviewDrawer
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Storefront Customer Reviews Strip"
      >
        <div className="bg-[#faf8f4] p-6 text-[#1a1a1a]">
          {/* Header */}
          <div className="text-center mb-6">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#1a2e1a] font-mono">
              REAL CUSTOMER VOICES
            </span>
            <h3 className="font-display text-xl font-bold text-[#1a1a1a] mt-1">
              Loved by 2,000+ Everyday Stylists
            </h3>
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="flex items-center text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    className={
                      s <= Math.round(reviewsData.averageRating)
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-gray-300'
                    }
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-[#1a1a1a]">
                {reviewsData.averageRating} / 5.0
              </span>
              <span className="text-xs text-[#7d7062]">
                ({reviewsData.totalReviewsCount}+ Verified Reviews)
              </span>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reviewsData.items.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-2xl p-4 border border-[#e8d5b7] shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center text-amber-500">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          className={s <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-200'}
                        />
                      ))}
                    </div>
                    {rev.verified && (
                      <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Verified
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-[#1a1a1a] mb-1">
                    &quot;{rev.title}&quot;
                  </h4>
                  <p className="text-[11px] text-[#63574a] leading-relaxed">
                    {rev.comment}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-[#f0ece4] text-[10px] text-[#7d7062]">
                  <p className="font-bold text-[#1a1a1a]">{rev.name}</p>
                  <p>
                    {rev.city} • {rev.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ModulePreviewDrawer>
    </div>
  )
}
