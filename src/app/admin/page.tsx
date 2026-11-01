'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useStore } from '@/context/StoreContext'
import {
  LayoutDashboard,
  ShoppingBag,
  Grid,
  MessageSquare,
  Home,
  Percent,
  MessageCircle,
  Settings,
  Star,
  Save,
  Eye,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Check,
  Database,
  Cloud,
  LucideIcon,
} from 'lucide-react'

// Admin Modules
import DashboardModule from '@/components/admin/modules/DashboardModule'
import ProductsModule from '@/components/admin/modules/ProductsModule'
import CategoriesModule from '@/components/admin/modules/CategoriesModule'
import EnquiriesModule from '@/components/admin/modules/EnquiriesModule'
import HomepageModule from '@/components/admin/modules/HomepageModule'
import PromotionsModule from '@/components/admin/modules/PromotionsModule'
import WhatsAppModule from '@/components/admin/modules/WhatsAppModule'
import SettingsModule from '@/components/admin/modules/SettingsModule'
import ReviewsModule from '@/components/admin/modules/ReviewsModule'
import UnsavedChangesModal from '@/components/admin/UnsavedChangesModal'

type TabId =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'enquiries'
  | 'homepage'
  | 'promotions'
  | 'whatsapp'
  | 'settings'
  | 'reviews'

interface TabConfig {
  id: TabId
  label: string
  icon: LucideIcon
  badge?: string
}

const TABS: TabConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: ShoppingBag },
  { id: 'categories', label: 'Categories', icon: Grid },
  { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
  { id: 'homepage', label: 'Homepage Editor', icon: Home },
  { id: 'promotions', label: 'Promotions', icon: Percent },
  { id: 'whatsapp', label: 'WhatsApp Manage', icon: MessageCircle },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'reviews', label: 'Reviews', icon: Star },
]

export default function AdminDashboardPage() {
  const router = useRouter()
  const {
    draft,
    isDirty,
    isSaving,
    isLoading,
    saveDraft,
    discardDraft,
    globalPreviewMode,
    setGlobalPreviewMode,
  } = useStore()

  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState<TabId>('dashboard')
  const [pendingTab, setPendingTab] = useState<TabId | null>(null)
  const [unsavedModalOpen, setUnsavedModalOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [saveSuccessToast, setSaveSuccessToast] = useState(false)

  // Sub-navigation bridge states
  const [categoryFilterForProducts, setCategoryFilterForProducts] = useState<string | null>(null)
  const [openCreateProductOnMount, setOpenCreateProductOnMount] = useState(false)

  // Auth gate check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('varna_admin_session') === 'true'
      if (!isAuth) {
        router.replace('/admin/login')
      } else {
        setAuthenticated(true)
      }
    }
  }, [router])

  // Prevent accidental browser tab close if dirty
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  // Tab switching with unsaved changes interception
  const handleTabClick = (targetTab: TabId) => {
    if (targetTab === activeTab) return

    if (isDirty) {
      setPendingTab(targetTab)
      setUnsavedModalOpen(true)
    } else {
      setActiveTab(targetTab)
      setMobileMenuOpen(false)
    }
  }

  const handleDiscardAndSwitch = () => {
    discardDraft()
    if (pendingTab) {
      setActiveTab(pendingTab)
      setPendingTab(null)
    }
    setUnsavedModalOpen(false)
    setMobileMenuOpen(false)
  }

  const handleSaveAndContinue = async () => {
    const success = await saveDraft()
    if (success) {
      showSavedToast()
      if (pendingTab) {
        setActiveTab(pendingTab)
        setPendingTab(null)
      }
      setUnsavedModalOpen(false)
      setMobileMenuOpen(false)
    }
  }

  const handleManualSave = async () => {
    const success = await saveDraft()
    if (success) {
      showSavedToast()
    }
  }

  const showSavedToast = () => {
    setSaveSuccessToast(true)
    setTimeout(() => {
      setSaveSuccessToast(false)
    }, 3000)
  }

  const handleLogout = () => {
    if (isDirty) {
      if (!confirm('You have unsaved changes. Logging out will discard them. Continue?')) {
        return
      }
    }
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('varna_admin_session')
    }
    router.replace('/admin/login')
  }

  // Cross-module bridge: Add Product from Category Tile
  const handleAddProductFromCategory = (categoryName: string) => {
    setCategoryFilterForProducts(categoryName)
    setOpenCreateProductOnMount(true)
    setActiveTab('products')
  }

  if (authenticated === null || isLoading) {
    return (
      <div className="min-h-screen bg-[#0b120c] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-3 border-[#c4a675] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono tracking-widest text-[#c4a675] uppercase">
          Initializing Varna Vault...
        </p>
      </div>
    )
  }

  const currentTabConfig = TABS.find((t) => t.id === activeTab)

  return (
    <div className="min-h-screen bg-[#0b120c] text-[#f4efe6] flex flex-col">
      {/* Save Success Floating Notification Banner */}
      {saveSuccessToast && (
        <div className="fixed top-5 right-5 z-[100] bg-[#1a2e1a] text-white border border-[#25D366] px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-8 h-8 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center flex-shrink-0">
            <Check size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-white">All Changes Saved Live!</p>
            <p className="text-[11px] text-[#e8d5b7]">
              Synchronized to MongoDB Atlas &amp; Cloudinary CDN
            </p>
          </div>
        </div>
      )}

      {/* Unsaved Changes Guard Dialog */}
      <UnsavedChangesModal
        isOpen={unsavedModalOpen}
        moduleName={currentTabConfig?.label || 'Module'}
        onStay={() => setUnsavedModalOpen(false)}
        onDiscard={handleDiscardAndSwitch}
        onSaveAndContinue={handleSaveAndContinue}
        isSaving={isSaving}
      />

      {/* Master Top Header Bar */}
      <header className="h-16 border-b border-white/10 bg-[#0e160f]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#f4efe6] cursor-pointer"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-white/10 border border-[#c4a675]/40 flex items-center justify-center overflow-hidden flex-shrink-0">
              <Image
                src={draft.settings?.logoUrl || '/images/logo/varna-logo.webp'}
                alt="Varna"
                width={36}
                height={36}
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-sm tracking-wide text-white">
                  VARNA
                </span>
                <span className="text-[9px] font-bold tracking-widest uppercase bg-[#c4a675]/20 text-[#c4a675] px-2 py-0.5 rounded-full border border-[#c4a675]/30">
                  VAULT
                </span>
              </div>
              <p className="text-[10px] text-[#a89d8f] hidden sm:block">
                Master Easter Egg Storefront Controller
              </p>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Staging dirty indicator */}
          <div className="hidden sm:flex items-center">
            {isDirty ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-300 bg-amber-950/60 border border-amber-500/40 px-3 py-1 rounded-full animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Unsaved Draft</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Synced Live</span>
              </span>
            )}
          </div>

          {/* Global Store Preview Toggle */}
          <button
            type="button"
            onClick={() => setGlobalPreviewMode(!globalPreviewMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              globalPreviewMode
                ? 'bg-amber-500 text-black border-amber-400 shadow-md ring-2 ring-amber-400/30'
                : 'bg-white/5 hover:bg-white/10 text-[#f4efe6] border-white/10'
            }`}
            title="Preview how the draft looks across the entire live storefront"
          >
            <Eye size={14} className={globalPreviewMode ? 'text-black' : 'text-[#c4a675]'} />
            <span className="hidden sm:inline">
              {globalPreviewMode ? 'Draft Preview Active' : 'Global Preview'}
            </span>
          </button>

          {/* Master Save Changes Button */}
          <button
            type="button"
            onClick={handleManualSave}
            disabled={!isDirty || isSaving}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
              isDirty
                ? 'bg-[#25D366] hover:bg-[#1fb355] text-black shadow-[0_4px_16px_rgba(37,211,102,0.3)] animate-pulse'
                : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/5'
            }`}
          >
            {isSaving ? (
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save size={14} />
            )}
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>

          {/* Storefront Link */}
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#a89d8f] hover:text-white border border-white/10 text-xs transition-colors"
            title="Open live website in new tab"
          >
            <span>Storefront</span>
            <ExternalLink size={12} />
          </Link>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 rounded-xl bg-white/5 hover:bg-red-950/50 hover:text-red-300 text-[#a89d8f] border border-white/10 transition-colors cursor-pointer"
            title="Logout from Admin Vault"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* SIDEBAR NAVIGATION (Desktop & Mobile Drawer) */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#0e160f] border-r border-white/10 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? 'translate-x-0 top-16' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          {/* Tabs List */}
          <div className="p-3 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#a89d8f] font-mono">
              Store Control Modules
            </div>

            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabClick(tab.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#18241b] text-white border border-[#c4a675]/40 shadow-inner'
                      : 'text-[#a89d8f] hover:text-[#f4efe6] hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={17}
                      className={isActive ? 'text-[#c4a675]' : 'text-[#7d7062]'}
                    />
                    <span>{tab.label}</span>
                  </div>

                  {tab.id === 'enquiries' && (draft.enquiries?.length || 0) > 0 && (
                    <span className="text-[10px] font-bold bg-[#25D366]/20 text-[#25D366] px-2 py-0.5 rounded-full border border-[#25D366]/30">
                      {draft.enquiries?.length}
                    </span>
                  )}
                  {tab.id === 'promotions' &&
                    (draft.promotions?.filter((p) => p.active)?.length || 0) > 0 && (
                      <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                        {draft.promotions?.filter((p) => p.active).length}
                      </span>
                    )}
                </button>
              )
            })}
          </div>

          {/* Bottom System Status & Cloud Connection Indicators */}
          <div className="p-4 border-t border-white/10 space-y-3 bg-[#0a100b]">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-[#a89d8f]">
                <span className="flex items-center gap-1.5">
                  <Database size={12} className="text-emerald-400" />
                  <span>MongoDB Atlas</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold">READY</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#a89d8f]">
                <span className="flex items-center gap-1.5">
                  <Cloud size={12} className="text-[#3b82f6]" />
                  <span>Cloudinary WebP</span>
                </span>
                <span className="text-[10px] font-mono text-[#3b82f6] font-bold">AUTO</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/5 text-[10px] text-[#7d7062] flex items-center justify-between">
              <span>Easter Egg Vault v2.6</span>
              <span className="font-mono text-[#c4a675]">Pass: varna2026</span>
            </div>
          </div>
        </aside>

        {/* MAIN MODULE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#0b120c]">
          <div className="max-w-6xl mx-auto space-y-6">
            {activeTab === 'dashboard' && (
              <DashboardModule
                onNavigateTab={(tab) => handleTabClick(tab as TabId)}
                onQuickAddProduct={() => {
                  setCategoryFilterForProducts(null)
                  setOpenCreateProductOnMount(true)
                  handleTabClick('products')
                }}
              />
            )}

            {activeTab === 'products' && (
              <ProductsModule
                initialCategoryFilter={categoryFilterForProducts}
                openCreateOnMount={openCreateProductOnMount}
              />
            )}

            {activeTab === 'categories' && (
              <CategoriesModule onAddProductForCategory={handleAddProductFromCategory} />
            )}

            {activeTab === 'enquiries' && <EnquiriesModule />}

            {activeTab === 'homepage' && <HomepageModule />}

            {activeTab === 'promotions' && <PromotionsModule />}

            {activeTab === 'whatsapp' && <WhatsAppModule />}

            {activeTab === 'settings' && <SettingsModule />}

            {activeTab === 'reviews' && <ReviewsModule />}
          </div>
        </main>
      </div>
    </div>
  )
}
