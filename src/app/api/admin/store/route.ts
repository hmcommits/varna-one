import { NextResponse } from 'next/server'
import { getMongoDb } from '@/lib/mongodb'
import { defaultStoreData } from '@/data/defaultStoreData'
import fs from 'fs'
import path from 'path'
import { StoreState } from '@/types/store'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 15

const LOCAL_STORE_FILE = path.join(process.cwd(), 'src', 'data', 'store.json')
const isVercel = Boolean(process.env.VERCEL)

// High-speed in-memory cache for visitor store reads (0ms response time)
let inMemoryStoreCache: { data: any; timestamp: number } | null = null
const CACHE_TTL_MS = 30 * 1000 // 30 seconds cache

function readLocalStore(): StoreState | null {
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      const data = fs.readFileSync(LOCAL_STORE_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch (err) {
    console.warn('Could not read local store.json:', err)
  }
  return null
}

function writeLocalStore(state: StoreState): boolean {
  // On Vercel, filesystem is read-only — skip silently
  if (isVercel) return false
  try {
    const dir = path.dirname(LOCAL_STORE_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(state, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.warn('Could not write local store.json:', err)
    return false
  }
}

/**
 * Strips the admin passcode from the store data before sending to
 * unauthenticated visitors. The storefront never needs the passcode.
 */
function sanitizeForPublic(data: any): any {
  const sanitized = { ...data }
  if (sanitized.settings) {
    sanitized.settings = { ...sanitized.settings }
    delete sanitized.settings.passcode
  }
  return sanitized
}

/**
 * Checks if the provided token matches the master secret or the store passcode.
 */
function isAuthenticated(providedToken: string | null, storePasscode: string): boolean {
  if (!providedToken) return false
  const token = providedToken.trim()
  const masterSecret = (process.env.ADMIN_SECRET_KEY || process.env.ADMIN_SECRET || '').trim()
  if (masterSecret && token === masterSecret) {
    return true
  }
  if (!storePasscode) return false
  return token === storePasscode.trim()
}

export async function GET(req: Request) {
  try {
    // Check if request is from an authenticated admin
    const providedToken =
      req.headers.get('x-admin-token') ||
      req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')

    // Fast path for public visitors: return in-memory cached store in 0.1ms
    if (!providedToken && inMemoryStoreCache && Date.now() - inMemoryStoreCache.timestamp < CACHE_TTL_MS) {
      return NextResponse.json(inMemoryStoreCache.data, {
        headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59' },
      })
    }

    const db = await getMongoDb()

    let storeData: any = null

    if (db) {
      const config = await db.collection('config').findOne({ _id: 'store_config' as any })
      if (config) {
        const { _id: _, ...data } = config
        storeData = data
      } else {
        // Seed MongoDB Atlas on first connect
        const initialData = readLocalStore() || defaultStoreData
        await db.collection('config').updateOne(
          { _id: 'store_config' as any },
          { $set: { ...initialData, _id: 'store_config' } },
          { upsert: true }
        )
        storeData = initialData
      }
    } else {
      storeData = readLocalStore() || defaultStoreData
    }

    // Resolve store-configured passcode
    const storePasscode =
      process.env.ADMIN_PASSCODE ||
      storeData?.settings?.passcode ||
      defaultStoreData.settings.passcode ||
      'varna2026'

    const isAdmin = isAuthenticated(providedToken || null, storePasscode)

    // Ensure stale emblem, raw fabric photo, or older small logo is replaced with balanced brandmark
    if (
      !storeData?.settings?.logoUrl ||
      storeData.settings.logoUrl.includes('varna-emblem') ||
      storeData.settings.logoUrl.includes('1793867092112') ||
      storeData.settings.logoUrl.includes('varna-transparent-brandmark') ||
      storeData.settings.logoUrl.includes('varna-curved-brandmark.webp')
    ) {
      if (storeData && storeData.settings) {
        storeData.settings.logoUrl =
          'https://res.cloudinary.com/o6jv6xte/image/upload/v1793871217/varna_store/logo/varna-curved-brandmark-v2.webp'
      }
    }

    // Sanitize: strip passcode from public storefront responses
    const responseData = isAdmin ? storeData : sanitizeForPublic(storeData)

    if (!isAdmin) {
      inMemoryStoreCache = { data: responseData, timestamp: Date.now() }
    }

    return NextResponse.json(responseData, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59' },
    })
  } catch (err) {
    console.error('Error fetching store state:', err)
    return NextResponse.json(sanitizeForPublic(defaultStoreData))
  }
}

export async function POST(req: Request) {
  try {
    const providedToken =
      req.headers.get('x-admin-token') ||
      req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')

    const token = (providedToken || '').trim()
    const masterSecret = (process.env.ADMIN_SECRET_KEY || process.env.ADMIN_SECRET || '').trim()
    const isMaster = Boolean(masterSecret && token === masterSecret)

    // For POST saves, allow up to 8000ms for connection to ensure data is safely persisted
    const db = await getMongoDb(8000)

    // Determine expected passcode from env, MongoDB, or local config
    let storePasscode = process.env.ADMIN_PASSCODE || ''

    if (!storePasscode) {
      if (db) {
        const existing = await db
          .collection('config')
          .findOne({ _id: 'store_config' as any })
        storePasscode =
          existing?.settings?.passcode ||
          defaultStoreData.settings.passcode ||
          'varna2026'
      } else {
        const local = readLocalStore()
        storePasscode =
          local?.settings?.passcode ||
          defaultStoreData.settings.passcode ||
          'varna2026'
      }
    }

    const isAuthorized = isMaster || Boolean(token && token === storePasscode.trim())

    // Security Gate: Reject unauthenticated requests
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing administrator authorization token' },
        { status: 401 }
      )
    }

    const body: StoreState = await req.json()
    body.lastUpdated = new Date().toISOString()

    let savedToMongo = false

    if (db) {
      await db.collection('config').updateOne(
        { _id: 'store_config' as any },
        { $set: { ...body, _id: 'store_config' } },
        { upsert: true }
      )
      savedToMongo = true
    } else if (isVercel) {
      console.error('MongoDB Atlas unavailable during POST /api/admin/store')
      return NextResponse.json(
        { error: 'Cloud database unavailable. Please verify MongoDB Atlas connection.' },
        { status: 503 }
      )
    }

    // Also persist to local file if possible (local dev)
    writeLocalStore(body)

    // Invalidate public store cache so merchant updates are visible immediately
    inMemoryStoreCache = null

    return NextResponse.json({
      success: true,
      timestamp: body.lastUpdated,
      storage: savedToMongo ? 'mongodb-atlas' : 'local-json',
    })
  } catch (err: any) {
    console.error('Error saving store state:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to save store state' },
      { status: 500 }
    )
  }
}
