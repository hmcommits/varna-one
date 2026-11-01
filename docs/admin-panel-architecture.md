# Varna Storefront: Admin Panel ("Varna Command Vault") Architecture Documentation

> **Project:** Varna – Custom Wear & Prints (*Wear Your Colors*)  
> **Target:** Freelance Client Delivery  
> **Deployment:** Deployed on Vercel (Domain via Hostinger)  
> **Access Route:** Strict 5-tap logo emblem $\rightarrow$ `/admin/login` $\rightarrow$ `/admin`

---

## 1. System Access & Single-Entrypoint Flow

There is strictly **one way** to access the admin area on both desktop and mobile:

```
[Storefront Navbar]
       │
   Tap Varna Logo Emblem 5 Times Rapidly
       │
       ▼
[/admin/login] (Dedicated Glassmorphic Login Portal)
       │
   Enter Passcode: "varna2026" (with Quick Demo Fill)
       │
       ▼
[/admin] (Full-Page Command Vault)
```

1. **Trigger:** Rapidly tap the Varna logo emblem in the Navbar **5 times**.
   - Shimmering gold pulse feedback around the emblem.
   - Automatically navigates to `/admin/login`.
   - All other shortcuts (keyboard, footer clicks, etc.) are removed.
2. **Login Screen (`/admin/login`):**
   - Dedicated, full-page luxury glassmorphic login screen.
   - Centered Varna emblem, passcode field (`varna2026`), and a "Quick Demo Fill" button.
3. **Admin Panel (`/admin`):**
   - Full-page dashboard route (`/admin`) with sidebar navigation.
   - Protected: Direct URL access to `/admin` without logging in immediately redirects to `/admin/login`.
   - Top right: `[Logout]` and `[← View Storefront]`.

---

## 2. Core Guard & Preview Rules

### A. Draft Staging Buffer (Zero Live Leakage)
- When the admin edits any field, price, text, or image, it remains in a local staging buffer.
- **The live website remains 100% untouched until explicitly saved.**
- An unsaved-changes indicator appears: `● Unsaved Changes (Draft)`.
- Clicking `[Save Changes]` writes the draft to the database and updates the live website.

### B. Unsaved Changes Exit Guard Modal
If the admin has unsaved edits in a module and tries to switch to another module or close the panel, a confirmation modal halts navigation:
> *"⚠️ You have unsaved changes in [Module Name]. If you leave without saving, your edits will be discarded. `[Discard Changes]` / `[Stay Here]` / `[Save & Continue]`"*

### C. Two-Tier Preview System
1. **Module-Level Preview (`[Preview Module]` Button):**
   - Available on every module header.
   - Opens an inline modal showing the rendered component with draft changes applied.
   - Responsive toggles: **Mobile (375px)** | **Tablet (768px)** | **Desktop (1280px)**.
2. **General Storefront Preview (`[Global Store Preview]` Button):**
   - Permanently accessible in the Admin Vault top bar.
   - Renders the complete live storefront loaded with all current draft modifications across all modules.

---

## 3. The 9 Modules Breakdown

### Module 1: Dashboard (Descriptive & Card-Rich)
- **Descriptive Stat Cards:**
  - 🛍️ **Total Products:** Total count with breakdown by category (*Shirts, T-Shirts, Dresses, Jeans, etc.*).
  - 📂 **Total Categories:** Active categories on storefront.
  - ⭐ **Reviews on Website:** Total verified reviews count and average rating score (e.g. *4.6 ★ across 120 reviews*).
  - 💬 **WhatsApp Clicks:** Total concierge enquiry clicks tracked.
  - 🏷️ **Current Offers:** Active promotions count and banner status.
  - 🟢 **Store Status:** Live status pill (`Online` / `Flash Sale` / `Maintenance`).
- **Recent Inquiries Stream:** Table of the last 5 WhatsApp customer leads.
- **Actions:** `[Save Changes]`.

---

### Module 2: Products (Catalog, Variants, Customizations & Color-to-Image Mapping)
- **Products Inventory Table:** View, edit, delete products.
- **Product Form:**
  - Basic details (Title, Category, Gender).
  - Pricing (Selling Price & Original MRP $\rightarrow$ auto-computes Discount % badge).
  - Status Badge: `None`, `New`, `Trending`, `Bestseller`, `Flash Sale` (colors automatic: green, red, amber).
  - Available Sizes: Checkboxes `S`, `M`, `L`, `XL`, `XXL`.
  - Stock Urgency: `In Stock` | `Only 3 left` | `Out of Stock`.
  - **Color & Image Manager:**
    - Per-color image mapping.
    - Color picker with native **"Pick Color from Image" (Eyedropper)** tool.
    - Clickable existing color chips for subsequent images.
    - **Live UI Sync:** When customer taps a color swatch on PDP or card, main photo instantly switches to match that color.
  - **Multi-Option Customization Add-On:**
    - Toggle: `Customization` (On / Off).
    - When ON:
      - Field for `Customization Type` (with examples: *"Pocket Monogram Embroidery"*, *"HD DTF Back Print"*, *"Custom Sleeve Text"*).
      - Field for `Price` (₹).
      - `[+ Add Another Customization]` button for multiple options.
    - Displays a sleek **"Customization Available"** badge on the product card during catalog browsing!
  - PDP Specs: Fabric & Care notes, Size guide chart numbers.
- **Actions:** `[Preview Product]` and `[Save Changes]`.

---

### Module 3: Categories (Visual Grid & Quick-Add Shortcut)
- 6 Category blocks (Shirts, T-Shirts, Dresses, Jeans, Tops, Co-ords).
- Edit: Title, subtitle/price tag, image, link.
- **⚡ Category $\rightarrow$ Product Shortcut:**
  - Every category row has an **`[+ Add Product in this Category]`** button.
  - Clicking it smoothly switches to the **Products Tab**, opens the **Add Product form**, and **pre-selects that specific category**!
- **Actions:** `[Preview Categories]` and `[Save Changes]`.

---

### Module 4: Enquiries (Concierge Pipeline & Leads)
- Activity table logging all WhatsApp clicks (Timestamp, Product, Color, Size, Quantity, Custom Notes).
- *(Total order value removed since customers bargain/negotiate final prices on WhatsApp)*.
- **Direct Actions:**
  - **`Mark as Completed`** (toggles green completed checkmark).
  - **`Remove`** (deletes the entry).
- `[Export to CSV]` button.
- **Actions:** `[Save Changes]`.

---

### Module 5: Homepage Editor (Visual Merchandising & Copy)
1. **Top Announcement Bar (The Green Bar at Very Top):**
   - Visibility toggle.
   - **Text Fields (Limit: Up to 3 Fields):** Text 1, Text 2, Text 3 (rotates/scrolls in marquee).
   - *(Free shipping threshold removed)*.
2. **Trending Ticker Marquee:**
   - Chips list (*"FLAT 30% OFF"*, *"240 GSM COTTON"*, etc.) with add/remove controls.
3. **Dynamic Split Promo Banners:**
   - Admin can **Add New Banners** or **Delete Existing Banners**.
   - **Adaptive UI Grid:** Live storefront automatically adapts (1 banner = full-width hero, 2 = 2-column split, 3 = 3-column, 4 = 2x2 grid) with zero visual disruption.
4. **Trust Badges ("Why Varna"):**
   - 4 value propositions (Free Express Delivery, Easy Return & Exchange, Custom Tailoring Guarantee, Pre-Washed Fabric Guarantee).
- **Actions:** `[Preview Homepage]` and `[Save Changes]`.

---

### Module 6: Promotions (Simple Campaigns & Offer Engine)
- Simple CRUD: Create, Edit, Delete promotions easily.
- Fields: Title, Discount Badge / Code (*"FLAT 30% OFF"*, *"Use code VARNA15"*).
- **Display Options (Where it appears):**
  - ☑ **Top Announcement Bar**
  - ☑ **Floating Toast Notification**
  - ☑ **Product Cards Discount Tag**
- Status toggle: Active / Inactive.
- **Actions:** `[Preview Promotion]` and `[Save Changes]`.

---

### Module 7: WhatsApp Manage (Concierge Number & Templates)
- Master WhatsApp Business Number (`+91 6363145972`).
- 4 Dynamic Message Templates: General Enquiry, Product Card Enquiry, Full PDP Order, and Custom Printing Enquiry.
- Floating Concierge Button options: Show/Hide, Text (*"Enquire"*), Glow effect on/off.
- **Actions:** `[Test & Preview Message]` and `[Save Changes]`.

---

### Module 8: Settings (Store Identity & Logo Manager)
- **Logo Manager:** Upload new logo file (auto-converted to WebP), select from presets, or set image URL.
- Store Identity: Name, Subtitle, Slogan, Support Phone, Studio Address, Copyright.
- **Actions:** `[Preview Settings]` and `[Save Changes]`.

---

### Module 9: Reviews & Testimonials
- Manage customer testimonials (Name, City, Rating 1–5, Review Title, Comment, Verified Buyer badge).
- Overall store rating score (4.6 / 5.0).
- **Actions:** `[Preview Reviews]` and `[Save Changes]`.

---

## 4. Universal User Safety Principles
1. Every module has `[Preview]` and `[Save Changes]`.
2. Changes exist in a **draft state** and NEVER update the live site until `Save Changes` is clicked.
3. Leaving a module with unsaved edits triggers the **Unsaved Changes Confirmation Dialog** (`Discard` / `Stay` / `Save`).
4. Master header has `[Global Store Preview]` to test the whole store in draft mode.
