'use client'
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { CartItem, DeliveryAddress } from '@/types/store'

interface CartContextType {
  cart: CartItem[]
  totalItems: number
  subtotal: number
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

  const contextValue = useMemo<CartContextType>(
    () => ({
      cart,
      totalItems,
      subtotal,
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
