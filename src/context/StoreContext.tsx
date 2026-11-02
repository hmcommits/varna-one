'use client'
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { StoreState, EnquiryItem } from '@/types/store'
import { defaultStoreData } from '@/data/defaultStoreData'

const LOCAL_STORAGE_KEY = 'varna_store_data_v1'

export interface ActiveViewingProduct {
  productId: string
  name: string
  category?: string
  color?: string
  size?: string
  quantity?: number
  price?: number
  originalPrice?: number
  url?: string
  customOptions?: string[]
  customNotes?: string
  isBulkOrder?: boolean
}

interface StoreContextType {
  store: StoreState
  draft: StoreState
  isDirty: boolean
  isSaving: boolean
  isLoading: boolean
  globalPreviewMode: boolean
  setGlobalPreviewMode: (enabled: boolean) => void
  updateDraft: (updater: (prev: StoreState) => StoreState) => void
  saveDraft: () => Promise<boolean>
  discardDraft: () => void
  logEnquiry: (enquiry: Partial<EnquiryItem>) => Promise<void>
  activeStore: StoreState
  catalogFilter: string
  setCatalogFilter: (filter: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectCatalogFilter: (filter: string, scrollToSection?: boolean) => void
  activeViewingProduct: ActiveViewingProduct | null
  setActiveViewingProduct: (product: ActiveViewingProduct | null) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

/**
 * Returns the admin token from sessionStorage if authenticated.
 * Safe for all browsers — returns null when sessionStorage is unavailable.
 */
function getAdminToken(): string | null {
  try {
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('varna_admin_session') === 'true'
      if (isAuth) {
        return sessionStorage.getItem('varna_admin_token')
      }
    }
  } catch {
    // sessionStorage may throw in some restricted contexts (e.g. cross-origin iframes)
  }
  return null
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<StoreState>(defaultStoreData)
  const [draft, setDraft] = useState<StoreState>(defaultStoreData)
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [globalPreviewMode, setGlobalPreviewMode] = useState(false)
  const [catalogFilter, setCatalogFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeViewingProduct, setActiveViewingProduct] = useState<ActiveViewingProduct | null>(null)

  const selectCatalogFilter = useCallback((filter: string, scrollToSection = true) => {
    setCatalogFilter(filter)
    if (scrollToSection && typeof window !== 'undefined') {
      const el = document.getElementById('new-arrivals')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [])

  // 1. Initial Load: Stale-While-Revalidate (Instant 0ms first-time and returning load speed)
  useEffect(() => {
    // Immediate 0ms synchronous local hydration: use localStorage if available, or defaultStoreData
    let initialSeed = defaultStoreData
    try {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (cached) {
          const parsed = JSON.parse(cached)
          if (parsed && Array.isArray(parsed.products)) {
            initialSeed = parsed
          }
        }
      }
    } catch {
      // LocalStorage access restricted or invalid JSON
    }

    // Instantly hydrate storefront so first-time visitors see products in 0ms without waiting
    setStore(initialSeed)
    setDraft(initialSeed)
    setIsLoading(false)

    async function loadInitialData() {
      try {
        // If admin is authenticated, send token so server returns full data
        // (including settings.passcode needed for password change in SettingsModule)
        const adminToken = getAdminToken()
        const headers: Record<string, string> = {}
        if (adminToken) {
          headers['x-admin-token'] = adminToken
        }

        const res = await fetch('/api/admin/store', { headers })
        if (res.ok) {
          const remoteData: StoreState = await res.json()
          if (remoteData && remoteData.products) {
            setStore(remoteData)
            setDraft(remoteData)
            try {
              if (typeof window !== 'undefined') {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remoteData))
              }
            } catch {
              // localStorage may be full or restricted in some browsers
            }
            return
          }
        }
      } catch (err) {
        console.warn('Could not fetch from server API, using local fallback:', err)
      }
    }

    loadInitialData()
  }, [])

  // 2. Update Draft (In-memory staging buffer)
  const updateDraft = useCallback((updater: (prev: StoreState) => StoreState) => {
    setDraft((prev) => {
      const next = updater(prev)
      setIsDirty(true)
      return next
    })
  }, [])

  // 3. Save Draft -> Commit to Server API (MongoDB Atlas) & LocalStorage
  const saveDraft = useCallback(async (): Promise<boolean> => {
    setIsSaving(true)
    try {
      const updatedDraft = {
        ...draft,
        lastUpdated: new Date().toISOString(),
      }

      const adminToken =
        getAdminToken() ||
        updatedDraft.settings?.passcode ||
        'varna2026'

      const res = await fetch('/api/admin/store', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify(updatedDraft),
      })

      if (res.ok) {
        setStore(updatedDraft)
        setDraft(updatedDraft)
        setIsDirty(false)
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedDraft))
          }
        } catch {
          // localStorage quota exceeded — non-fatal
        }
        setIsSaving(false)
        return true
      }
    } catch (err) {
      console.error('Error saving store to server:', err)
    }

    // Fallback save to local storage
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(draft))
      }
    } catch {
      // non-fatal
    }
    setStore(draft)
    setIsDirty(false)
    setIsSaving(false)
    return true
  }, [draft])

  // 4. Discard Draft -> Revert staging to published store
  const discardDraft = useCallback(() => {
    setDraft(store)
    setIsDirty(false)
  }, [store])

  // 5. Customer Enquiry Logging
  const logEnquiry = useCallback(async (enquiryData: Partial<EnquiryItem>) => {
    try {
      const res = await fetch('/api/admin/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiryData),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.enquiry) {
          setStore((prev) => ({
            ...prev,
            enquiries: [data.enquiry, ...(prev.enquiries || [])],
          }))
          setDraft((prev) => ({
            ...prev,
            enquiries: [data.enquiry, ...(prev.enquiries || [])],
          }))
        }
      }
    } catch (err) {
      console.warn('Could not log enquiry to API:', err)
    }
  }, [])

  // The active store consumed by components:
  // If globalPreviewMode is ON, we show the draft state; otherwise published store state!
  const activeStore = globalPreviewMode ? draft : store

  return (
    <StoreContext.Provider
      value={{
        store,
        draft,
        isDirty,
        isSaving,
        isLoading,
        globalPreviewMode,
        setGlobalPreviewMode,
        updateDraft,
        saveDraft,
        discardDraft,
        logEnquiry,
        activeStore,
        catalogFilter,
        setCatalogFilter,
        searchQuery,
        setSearchQuery,
        selectCatalogFilter,
        activeViewingProduct,
        setActiveViewingProduct,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
