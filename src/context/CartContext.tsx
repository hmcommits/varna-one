'use client'
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { CartItem, DeliveryAddress } from '@/types/store'
import { useStore } from '@/context/StoreContext'

interface CartContextType {
  cart: CartItem[]
  totalItems: number
  subtotal: number
  deliveryFee: number
  isFreeDelivery: boolean
  totalPayable: number
  freeThreshold: number
  amountToFreeDelivery: number
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  openCart: () => void
  closeCart: () => void
  isCheckoutOpen: boolean
  setIsCheckoutOpen: (open: boolean) => void
  openCheckout: () => void
  closeCheckout: () => void
  addToCart: (item: Omit<CartItem, 'id'>, openCartDrawer?: boolean) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, newQty: number) => void
  clearCart: () => void
  savedAddress: DeliveryAddress | null
  saveAddress: (addr: DeliveryAddress) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'varna_cart_items'
const ADDRESS_STORAGE_KEY = 'varna_delivery_address'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { activeStore } = useStore()
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [savedAddress, setSavedAddress] = useState<DeliveryAddress | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Rehydrate cart and address from localStorage on client mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (storedCart) {
        const parsed = JSON.parse(storedCart)
        if (Array.isArray(parsed)) {
          setCart(parsed)
        }
      }

      const storedAddress = localStorage.getItem(ADDRESS_STORAGE_KEY)
      if (storedAddress) {
        const parsedAddr = JSON.parse(storedAddress)
        if (parsedAddr && typeof parsedAddr === 'object') {
          setSavedAddress(parsedAddr)
        }
      }
    } catch (err) {
      console.warn('Could not rehydrate cart from storage:', err)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Persist cart to localStorage whenever it changes (after initial hydration)
  useEffect(() => {
    if (!isHydrated) return
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    } catch (err) {
      console.warn('Could not save cart to storage:', err)
    }
  }, [cart, isHydrated])

  const openCart = useCallback(() => {
    setIsCheckoutOpen(false)
    setIsCartOpen(true)
  }, [])

  const closeCart = useCallback(() => {
    setIsCartOpen(false)
  }, [])

  const openCheckout = useCallback(() => {
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }, [])

  const closeCheckout = useCallback(() => {
    setIsCheckoutOpen(false)
  }, [])

  const saveAddress = useCallback((addr: DeliveryAddress) => {
    setSavedAddress(addr)
    try {
      localStorage.setItem(ADDRESS_STORAGE_KEY, JSON.stringify(addr))
    } catch (err) {
      console.warn('Could not save delivery address:', err)
    }
  }, [])

  const addToCart = useCallback(
    (item: Omit<CartItem, 'id'>, openCartDrawer = true) => {
      // Normalize unique key based on product ID, color, size, and custom notes
      const normalizedNotes = (item.customNotes || '').trim().toLowerCase()
      const normalizedAddOns = (item.customAddOns || []).sort().join('|')
      const uniqueId = `${item.productId}_${item.color}_${item.size}_${normalizedNotes}_${normalizedAddOns}`
        .replace(/\s+/g, '-')
        .toLowerCase()

      setCart((prevCart) => {
        const existingIndex = prevCart.findIndex((ci) => ci.id === uniqueId)
        if (existingIndex > -1) {
          // Increase quantity of existing line item
          const updated = [...prevCart]
          const existing = updated[existingIndex]
          updated[existingIndex] = {
            ...existing,
            quantity: existing.quantity + item.quantity,
          }
          return updated
        }

        // Add brand new item
        return [
          {
            ...item,
            id: uniqueId,
          },
          ...prevCart,
        ]
      })

      if (openCartDrawer) {
        setIsCartOpen(true)
      }
    },
    []
  )

  const removeFromCart = useCallback((id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }, [])

  const updateQuantity = useCallback((id: string, newQty: number) => {
    if (newQty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id))
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity: Math.min(99, newQty) } : item))
    )
  }, [])

  const clearCart = useCallback(() => {
    setCart([])
    try {
      localStorage.removeItem(CART_STORAGE_KEY)
    } catch (err) {
      console.warn('Could not clear cart storage:', err)
    }
  }, [])

  const totalItems = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }, [cart])

  // Shipping & Delivery Policy Engine
  const deliveryPolicy = useMemo(() => {
    const s = activeStore.settings || {}
    const isFreeOnAll = s.freeDelivery !== false
    const baseFee = s.deliveryFee !== undefined ? Number(s.deliveryFee) : 99
    const freeThreshold = s.freeDeliveryThreshold !== undefined ? Number(s.freeDeliveryThreshold) : 999

    if (cart.length === 0) {
      return {
        deliveryFee: 0,
        isFreeDelivery: true,
        totalPayable: 0,
        freeThreshold,
        amountToFreeDelivery: 0,
      }
    }

    if (isFreeOnAll) {
      return {
        deliveryFee: 0,
        isFreeDelivery: true,
        totalPayable: subtotal,
        freeThreshold: 0,
        amountToFreeDelivery: 0,
      }
    }

    // Paid delivery with optional threshold
    const qualifiesForFree = freeThreshold > 0 && subtotal >= freeThreshold
    const fee = qualifiesForFree ? 0 : baseFee
    const toFree = !qualifiesForFree && freeThreshold > 0 ? Math.max(0, freeThreshold - subtotal) : 0

    return {
      deliveryFee: fee,
      isFreeDelivery: qualifiesForFree,
      totalPayable: subtotal + fee,
      freeThreshold,
      amountToFreeDelivery: toFree,
    }
  }, [activeStore.settings, cart.length, subtotal])

  const contextValue = useMemo<CartContextType>(
    () => ({
      cart,
      totalItems,
      subtotal,
      deliveryFee: deliveryPolicy.deliveryFee,
      isFreeDelivery: deliveryPolicy.isFreeDelivery,
      totalPayable: deliveryPolicy.totalPayable,
      freeThreshold: deliveryPolicy.freeThreshold,
      amountToFreeDelivery: deliveryPolicy.amountToFreeDelivery,
      isCartOpen,
      setIsCartOpen,
      openCart,
      closeCart,
      isCheckoutOpen,
      setIsCheckoutOpen,
      openCheckout,
      closeCheckout,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      savedAddress,
      saveAddress,
    }),
    [
      cart,
      totalItems,
      subtotal,
      deliveryPolicy,
      isCartOpen,
      openCart,
      closeCart,
      isCheckoutOpen,
      openCheckout,
      closeCheckout,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      savedAddress,
      saveAddress,
    ]
  )

  return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
