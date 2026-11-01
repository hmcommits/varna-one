'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  Search,
  Bell,
  ChevronDown,
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
}

const TABS: TabConfig[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Products', icon: ShoppingBag },
  { id: 'categories', label: 'Categories', icon: Grid },
  { id: 'homepage', label: 'Homepage Editor', icon: Home },
  { id: 'promotions', label: 'Promotions & Sale', icon: Percent },
  { id: 'enquiries', label: 'Enquiries', icon: MessageSquare },
  { id: 'whatsapp', label: 'WhatsApp Manage', icon: MessageCircle },
  { id: 'reviews', label: 'Testimonials', icon: Star },
  { id: 'settings', label: 'Settings', icon: Settings },
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
  const [searchQuery, setSearchQuery] = useState('')

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
      <div className="min-h-screen bg-[#faf8f5] flex flex-col items-center justify-center text-[#142319]">
        <div className="w-12 h-12 border-3 border-[#1c3624] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold tracking-wider text-[#1c3624] uppercase">
          Loading Varna Admin...
        </p>
      </div>
    )
  }

  const currentTabConfig = TABS.find((t) => t.id === activeTab)
  const pendingEnquiriesCount = draft.enquiries?.filter((e) => !e.completed)?.length || 0

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#142319] flex">
      {/* Save Success Floating Notification Banner */}
      {saveSuccessToast && (
        <div className="fixed top-5 right-5 z-[100] bg-[#1c3624] text-white border border-[#25D366]/40 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="w-8 h-8 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center flex-shrink-0">
            <Check size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Changes Saved Live!</p>
            <p className="text-[11px] text-[#e8dccb]">
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

      {/* SIDEBAR (Desktop & Mobile Drawer) - Deep Forest Green Luxury */}
      <aside
        className={`fixed lg:sticky top-0 inset-y-0 left-0 z-40 w-64 h-screen bg-[#0f1d14] text-[#a0b4a4] flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 select-none overflow-hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Subtle Decorative Botanical Leaf Background Accents */}
        <div className="absolute top-0 left-0 pointer-events-none opacity-20">
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
            <path
              d="M0,0 Q60,20 80,80 Q20,60 0,0 Z"
              fill="#c8d8cc"
            />
            <path
              d="M10,0 Q70,40 60,110 Q20,70 10,0 Z"
              fill="#c8d8cc"
              opacity="0.6"
            />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 pointer-events-none opacity-15">
          <svg width="140" height="140" viewBox="0 0 140 140" fill="none">
            <path
              d="M0,140 Q40,80 110,60 Q70,120 0,140 Z"
              fill="#c8d8cc"
            />
          </svg>
        </div>

        {/* Top Brand Header */}
        <div className="p-6 pb-4 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold tracking-tight text-white">
                Varna
              </h1>
              <p className="text-[11px] font-medium text-[#9eb3a2] tracking-wide">
                Admin Panel
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-[#9eb3a2] hover:text-white p-1 rounded-lg"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs List */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar relative z-10 py-2">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            const isEnquiries = tab.id === 'enquiries'
            const count = isEnquiries ? pendingEnquiriesCount : 0

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#ede2d1] text-[#13251a] shadow-xs font-bold'
                    : 'text-[#9eb3a2] hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={17}
                    className={isActive ? 'text-[#13251a]' : 'text-[#8ea392]'}
                  />
                  <span>{tab.label}</span>
                </div>

                {isEnquiries && count > 0 && (
                  <span className="text-[10px] font-bold bg-[#e34b46] text-white px-2 py-0.5 rounded-full shadow-2xs">
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom Actions: View Website & Session */}
        <div className="p-4 border-t border-white/10 relative z-10 space-y-3">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 px-3.5 rounded-xl bg-[#183220] hover:bg-[#203f2a] text-[#f2ebe2] border border-[#2b4c34] text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>View Website</span>
            <ExternalLink size={13} className="text-[#9eb3a2]" />
          </Link>

          <div className="flex items-center justify-between pt-1 px-1 text-[11px] text-[#8ea392]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Atlas &amp; Cloudinary</span>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-[#9eb3a2] hover:text-red-300 transition-colors p-1"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT MAIN AREA (Header + Content) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header - Warm Clean White Bar */}
        <header className="h-16 bg-white border-b border-[#ece6dc] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          {/* Left: Mobile Hamburger & Search Input */}
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#2c3830] hover:bg-[#f2eee7] cursor-pointer"
              aria-label="Toggle Menu"
            >
              <Menu size={20} />
            </button>

            {/* Clean Pill Search Bar matching screenshot */}
            <div className="relative w-full hidden sm:block">
              <Search
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8b948d]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, categories, enquiries..."
                className="w-full bg-white border border-[#e4ded3] rounded-xl pl-9 pr-18 py-1.5 text-xs text-[#142319] placeholder-[#8b948d] focus:outline-hidden focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624]"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#8b948d] bg-[#f2eee7] border border-[#e4ded3] px-1.5 py-0.5 rounded-md">
                Ctrl + K
              </span>
            </div>
          </div>

          {/* Right: Actions, Status & Admin Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Dirty Changes Staging Status Badge */}
            {isDirty ? (
              <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full animate-pulse">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Unsaved Draft</span>
              </span>
            ) : (
              <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Live Synced</span>
              </span>
            )}

            {/* Global Store Preview Toggle */}
            <button
              type="button"
              onClick={() => setGlobalPreviewMode(!globalPreviewMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                globalPreviewMode
                  ? 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-300/40 shadow-xs'
                  : 'bg-[#faf6f0] hover:bg-[#f0eae0] text-[#1c3624] border-[#ded7cb]'
              }`}
              title="Preview changes across storefront"
            >
              <Eye size={14} className={globalPreviewMode ? 'text-amber-800' : 'text-[#845d1d]'} />
              <span className="hidden sm:inline">
                {globalPreviewMode ? 'Previewing Draft' : 'Global Preview'}
              </span>
            </button>

            {/* Master Save Changes Button (Dark Forest Green Pill) */}
            <button
              type="button"
              onClick={handleManualSave}
              disabled={!isDirty || isSaving}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer ${
                isDirty
                  ? 'bg-[#1c3624] hover:bg-[#152a1c] text-white shadow-md animate-pulse'
                  : 'bg-[#e8e4dc] text-[#8e897e] cursor-not-allowed'
              }`}
            >
              {isSaving ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={14} />
              )}
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>

            {/* Notification Bell with red dot */}
            <div className="relative p-2 rounded-xl text-[#3d4941] hover:bg-[#f2eee7] cursor-pointer">
              <Bell size={18} />
              {pendingEnquiriesCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#e34b46] ring-2 ring-white" />
              )}
            </div>

            {/* User Profile Avatar matching screenshot */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-[#e8e4dc]">
              <div className="w-8 h-8 rounded-full bg-[#1c3624] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                V
              </div>
              <div className="hidden sm:block text-left">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-[#142319] leading-tight">
                    Varna Admin
                  </span>
                  <ChevronDown size={13} className="text-[#8b948d]" />
                </div>
                <span className="text-[10px] text-[#78857c] block leading-tight">
                  Super Admin
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Body Canvas (Warm, Bright, Airy, Luxurious) */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
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
