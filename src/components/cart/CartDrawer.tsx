'use client'
import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function CartDrawer() {
  const {
    cart,
    totalItems,
    subtotal,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    openCheckout,
  } = useCart()

  // Prevent background scrolling when cart drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isCartOpen])

  if (!isCartOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#faf8f4] shadow-2xl flex flex-col border-l border-[#e8d5b7]/80 text-[#1a1a1a]">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-white border-b border-[#e8d5b7]/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#1a2e1a] text-white flex items-center justify-center">
                <ShoppingBag size={18} className="text-[#e8d5b7]" />
              </div>
              <div>
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#1a1a1a] leading-none">
                  Your Shopping Bag
                </h2>
                <span className="text-[11px] text-[#7d7062] font-medium">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={closeCart}
              className="w-8 h-8 rounded-full bg-[#faf8f4] hover:bg-[#e8d5b7]/40 text-[#7d7062] hover:text-[#1a1a1a] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white border border-[#e8d5b7] flex items-center justify-center text-[#8a7d6e] shadow-xs">
                  <ShoppingBag size={28} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-[#1a1a1a]">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-[#7d7062] max-w-xs mt-1 leading-relaxed">
                    Explore our handcrafted linen shirts, heavyweight tees, and hoodies tailored for everyday elegance.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-full bg-[#1a2e1a] hover:bg-[#25D366] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3 sm:p-3.5 border border-[#e8d5b7]/80 shadow-2xs flex gap-3.5 group hover:border-[#1a2e1a]/40 transition-all"
                >
                  {/* Thumbnail */}
                  <Link
                    href={`/products/${item.productId}`}
                    onClick={closeCart}
                    className="relative w-20 h-24 rounded-xl overflow-hidden bg-[#f3ede2] flex-shrink-0 border border-[#e8d5b7]/50 block"
                  >
                    <Image
                      src={
                        item.image ||
                        'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532655/varna_store/products/linen-shirt-terracotta.webp'
                      }
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-cover object-top"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <Link
                          href={`/products/${item.productId}`}
                          onClick={closeCart}
                          className="font-display text-xs sm:text-sm font-bold text-[#1a1a1a] hover:text-[#1a2e1a] transition-colors line-clamp-1 block"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#9e9080] hover:text-[#c85a44] p-1 transition-colors cursor-pointer"
                          title="Remove item"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>

                      {/* Variant Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap mt-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#faf8f4] text-[#63574a] px-2 py-0.5 rounded-md border border-[#e8d5b7]/60">
                          {item.colorHex && (
                            <span
                              className="w-2 h-2 rounded-full border border-black/20"
                              style={{ backgroundColor: item.colorHex }}
                            />
                          )}
                          <span>{item.color}</span>
                        </span>
                        <span className="text-[10px] font-bold bg-[#1a2e1a]/8 text-[#1a2e1a] px-2 py-0.5 rounded-md border border-[#1a2e1a]/15">
                          Size: {item.size}
                        </span>
                      </div>

                      {/* Customization Note Callout */}
                      {item.customNotes && (
                        <div className="mt-1.5 bg-[#faf6f0] border border-[#e8d5b7] rounded-md px-2 py-1 text-[10px] text-[#845d1d] flex items-center gap-1">
                          <Sparkles size={10} className="shrink-0 text-[#845d1d]" />
                          <span className="truncate">
                            Custom: &ldquo;{item.customNotes}&rdquo;
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Price and Stepper */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#f0ece4] mt-2">
                      <div className="flex items-center gap-1.5 bg-[#faf8f4] border border-[#e8d5b7] rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md bg-white text-[#1a1a1a] flex items-center justify-center hover:bg-[#e8d5b7]/30 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-xs font-bold text-[#1a1a1a] min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md bg-white text-[#1a1a1a] flex items-center justify-center hover:bg-[#e8d5b7]/30 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="font-display font-bold text-xs sm:text-sm text-[#1a1a1a]">
                          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-[#7d7062] block">
                            (₹{item.price.toLocaleString('en-IN')} each)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer with Summary & Checkout Trigger */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-[#e8d5b7]/80 space-y-3.5 shadow-lg">
              {/* Shipping & Guarantee Pills */}
              <div className="bg-[#faf8f4] rounded-xl p-2.5 border border-[#e8d5b7]/60 flex items-center justify-between text-[11px] text-[#63574a]">
                <div className="flex items-center gap-1.5 text-[#1e4a36] font-semibold">
                  <Truck size={13} />
                  <span>Free Express Delivery</span>
                </div>
                <div className="flex items-center gap-1 text-[#845d1d] font-semibold">
                  <ShieldCheck size={13} />
                  <span>Quality Assured</span>
                </div>
              </div>

              {/* Subtotal */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-[#7d7062]">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#7d7062]">
                  <span>Pan-India Shipping</span>
                  <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">
                    FREE
                  </span>
                </div>
                <div className="flex items-baseline justify-between pt-2 border-t border-[#e8d5b7]/60">
                  <span className="font-display font-bold text-sm sm:text-base text-[#1a1a1a]">
                    Total Payable
                  </span>
                  <span className="font-display text-xl sm:text-2xl font-bold text-[#1a2e1a]">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[10px] text-[#7d7062] text-right">
                  (Inclusive of all taxes)
                </p>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={openCheckout}
                className="w-full py-3.5 px-5 rounded-2xl bg-[#1a2e1a] hover:bg-[#25D366] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button
                type="button"
                onClick={closeCart}
                className="w-full text-center text-xs font-semibold text-[#7d7062] hover:text-[#1a1a1a] transition-colors py-1 cursor-pointer"
              >
                ← Continue Browsing Collection
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
