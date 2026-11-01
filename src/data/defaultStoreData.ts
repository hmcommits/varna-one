import { StoreState } from '@/types/store'

export const defaultStoreData: StoreState = {
  version: 1,
  lastUpdated: new Date().toISOString(),
  settings: {
    storeName: 'Varna',
    subtitle: 'Custom Wear & Prints',
    slogan: 'Wear Your Colors',
    supportPhone: '+91 6363145972',
    studioAddress: 'Indiranagar 100ft Road, Bengaluru, Karnataka 560038',
    copyrightText: '© 2026 Varna. All rights reserved. Crafted for comfort, curated to impress.',
    logoUrl:
      'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532654/varna_store/logo/varna-emblem.webp',
    passcode: 'varna2026',
    storeStatus: 'Online',
  },
  products: [
    {
      id: '1',
      name: 'Premium Pure Linen Casual Shirt',
      category: 'Shirts',
      gender: 'Men',
      price: 999,
      originalPrice: 1499,
      rating: 4.6,
      reviewCount: 120,
      stockUrgency: 'Only 3 left',
      badge: 'New',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [
        {
          id: 'terracotta',
          name: 'Desert Terracotta',
          hex: '#c4855a',
          image:
            'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532655/varna_store/products/linen-shirt-terracotta.webp',
          gallery: [
            'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532655/varna_store/products/linen-shirt-terracotta.webp',
            'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532656/varna_store/categories/cat-shirts.webp',
            'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532662/varna_store/banners/banner-men.webp',
          ],
        },
        {
          id: 'olive',
          name: 'Deep Forest Olive',
          hex: '#1a2e1a',
          image:
            'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532656/varna_store/categories/cat-shirts.webp',
          gallery: [
            'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532656/varna_store/categories/cat-shirts.webp',
            'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532655/varna_store/products/linen-shirt-terracotta.webp',
          ],
        },
        {
          id: 'navy',
          name: 'Royal Navy Indigo',
          hex: '#2c4a6e',
          image:
            'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532662/varna_store/banners/banner-men.webp',
          gallery: [
            'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532662/varna_store/banners/banner-men.webp',
            'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532655/varna_store/products/linen-shirt-terracotta.webp',
          ],
        },
      ],
      customization: {
        enabled: true,
        options: [
          {
            id: 'cust-1',
            type: 'Pocket Monogram Embroidery',
            price: 150,
          },
          {
            id: 'cust-2',
            type: 'HD DTF Custom Back Print',
            price: 250,
          },
        ],
      },
      description:
        'Tailored from 100% natural European flax fibers. Relaxed regular fit with spread collar and curved hem.',
      fabricCare:
        '100% natural European flax fibers (160 GSM). Enzyme softened to eliminate stiffness. Gentle cold machine wash, line dry in shade.',
      shippingPolicy:
        'Dispatched within 24-48 hours. Express delivery within 2-4 business days across India via Delhivery/Bluedart.',
      sizeChart: [
        { size: 'S', chestIn: '38', chestCm: '96.5', shoulderIn: '17.5', lengthIn: '28.5' },
        { size: 'M', chestIn: '40', chestCm: '101.5', shoulderIn: '18.0', lengthIn: '29.0' },
        { size: 'L', chestIn: '42', chestCm: '106.5', shoulderIn: '18.7', lengthIn: '29.5' },
        { size: 'XL', chestIn: '44', chestCm: '111.5', shoulderIn: '19.5', lengthIn: '30.0' },
        { size: 'XXL', chestIn: '46', chestCm: '117.0', shoulderIn: '20.2', lengthIn: '30.5' },
      ],
    },
  ],
  categories: [
    {
      id: 'cat-1',
      title: 'Linen & Casual Shirts',
      subtitle: 'Starting at ₹999',
      image:
        'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532656/varna_store/categories/cat-shirts.webp',
      link: '#new-arrivals',
      visible: true,
    },
    {
      id: 'cat-2',
      title: 'T-Shirts & Custom Jerseys',
      subtitle: '240 GSM Heavyweight',
      image:
        'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532658/varna_store/categories/cat-tshirts-jerseys.webp',
      link: '#new-arrivals',
      visible: true,
    },
    {
      id: 'cat-3',
      title: 'Dresses & One-Pieces',
      subtitle: 'Effortless Drapes',
      image:
        'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532659/varna_store/categories/cat-dresses.webp',
      link: '#new-arrivals',
      visible: true,
    },
    {
      id: 'cat-4',
      title: 'Jeans & Trousers',
      subtitle: 'Relaxed Daily Fits',
      image:
        'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532660/varna_store/categories/cat-jeans-trousers.webp',
      link: '#new-arrivals',
      visible: true,
    },
    {
      id: 'cat-5',
      title: 'Tops & Blouses',
      subtitle: 'Chic Everyday Staple',
      image:
        'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532657/varna_store/categories/cat-tops-blouses.webp',
      link: '#new-arrivals',
      visible: true,
    },
    {
      id: 'cat-6',
      title: 'Printed Co-ord Sets',
      subtitle: 'Complete Statements',
      image:
        'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532661/varna_store/categories/cat-coord-sets.webp',
      link: '#new-arrivals',
      visible: true,
    },
  ],
  promotions: [
    {
      id: 'promo-1',
      title: 'Festive Summer Drop',
      discountText: 'FLAT 30% OFF ON CUSTOM WEAR',
      code: 'FESTIVE30',
      active: true,
      saleProducts: [
        {
          productId: 'prod-1793532655',
          salePrice: 699,
        },
      ],
      displayOptions: {
        topBar: true,
        floatingToast: true,
        productBadge: true,
      },
    },
  ],
  enquiries: [
    {
      id: 'enq-1',
      timestamp: 'Today, 2:45 PM',
      productName: 'Premium Pure Linen Casual Shirt',
      color: 'Desert Terracotta',
      size: 'M (40")',
      quantity: 1,
      customNotes: "Initials 'HB' on left cuff",
      source: 'Product Details Page',
      completed: false,
    },
  ],
  homepage: {
    topBarVisible: true,
    topBarTexts: [
      '⚡ FESTIVE DROP: FLAT 30% OFF ON ALL CUSTOM PRINTS',
      '🚚 FREE EXPRESS DOORSTEP DELIVERY ACROSS INDIA',
      '🧵 100% PURE EUROPEAN FLAX LINEN • ZERO SHRINKAGE',
    ],
    tickerChips: [
      '⚡ FLAT 30% OFF ON ALL CUSTOM PRINTS',
      'PREMIUM 240 GSM HEAVYWEIGHT COTTON',
      '100% PURE EUROPEAN FLAX LINEN',
      'OVERNIGHT DISPATCH ACROSS INDIA',
      'JAPANESE LOCK-STITCH EMBROIDERY',
      'FREE EXPRESS SHIPPING ON ALL ORDERS',
    ],
    promoBanners: [
      {
        id: 'banner-men',
        title: 'Men’s Custom Streetwear',
        subtitle: '240 GSM Terry Tees & Oversized Hoodies',
        image:
          'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532662/varna_store/banners/banner-men.webp',
        link: '#men',
        ctaText: 'Explore Men →',
      },
      {
        id: 'banner-women',
        title: 'Women’s Curated Drapes',
        subtitle: 'Bespoke Co-ords, Pure Linen & Dresses',
        image:
          'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532663/varna_store/banners/banner-women.webp',
        link: '#women',
        ctaText: 'Explore Women →',
      },
    ],
    trustBadges: [
      {
        id: 'badge-1',
        title: 'Free Express Delivery',
        desc: 'Dispatched within 24h across India via premier couriers',
        iconKey: 'truck',
      },
      {
        id: 'badge-2',
        title: 'Easy Return & Exchange',
        desc: 'Hassle-free doorstep size swap if fit is not 100%',
        iconKey: 'rotate',
      },
      {
        id: 'badge-3',
        title: 'Bespoke Custom Prints',
        desc: 'HD DTF wash-tested prints & Japanese embroidery',
        iconKey: 'scissors',
      },
      {
        id: 'badge-4',
        title: 'Pre-Washed Pure Fabrics',
        desc: 'Enzyme softened, guaranteed zero shrinkage or itchiness',
        iconKey: 'shield',
      },
    ],
  },
  whatsapp: {
    phoneNumber: '916363145972',
    hoursNote: 'Online 10 AM – 9 PM daily (Typical reply: < 5 mins)',
    floatingButtonVisible: true,
    floatingButtonText: 'Enquire',
    luminousGlow: true,
    templateGeneral:
      "Hi Varna! I'm browsing your storefront and would like to ask a few questions about your collections and custom printing.",
    templateCard:
      "Hi Varna! I'd like to enquire about the {product_name} ({price}). Please share availability and delivery timeframe.",
    templatePdp:
      "Hi Varna! I'd like to order the {product_name}:\n• Color: {color}\n• Size: {size}\n• Quantity: {quantity}{custom_notes}\nPlease confirm product availability and dispatch timeline!",
    templateCustomPrint:
      "Hi Varna! I'm interested in bulk custom prints / embroidery for our team/college. Can we discuss designs, fabric samples, and volume pricing?",
  },
  reviews: {
    averageRating: 4.6,
    totalReviewsCount: 120,
    items: [
      {
        id: 'rev-1',
        name: 'Arjun Menon',
        city: 'Bengaluru',
        rating: 5,
        title: 'Cloud-soft from day 1',
        comment:
          'Most linen shirts under 2k feel stiff and scratchy until washed 5 times. This one was supple and breathable right out of the box. Ordered Size L, fits spot on.',
        verified: true,
        date: 'Verified Buyer • 3 days ago',
      },
      {
        id: 'rev-2',
        name: 'Vikram Sengupta',
        city: 'Mumbai',
        rating: 5,
        title: 'Perfect for coastal heat',
        comment:
          'Wore the Desert Terracotta shade for a sundowner in Goa. Kept me cool through the evening humidity. Concierge on WhatsApp dispatched it within a day!',
        verified: true,
        date: 'Verified Buyer • 1 week ago',
      },
      {
        id: 'rev-3',
        name: 'Rohan Kapoor',
        city: 'Delhi',
        rating: 4,
        title: 'Custom monogram looks elite',
        comment:
          'Asked for my initials embroidered on the left cuff via WhatsApp. They sent a quick mockup preview before stitching. Premium feel throughout.',
        verified: true,
        date: 'Verified Buyer • 2 weeks ago',
      },
    ],
  },
}
