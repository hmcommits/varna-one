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
 * Checks if the provided token matches the expected admin passcode.
 */
function isAuthenticated(providedToken: string | null, expectedPasscode: string): boolean {
  if (!providedToken || !expectedPasscode) return false
  return providedToken.trim() === expectedPasscode.trim()
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

    let expectedPasscode: string =
      process.env.ADMIN_SECRET_KEY || process.env.ADMIN_PASSCODE || ''

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

    // Resolve expected passcode if not from env
    if (!expectedPasscode) {
      expectedPasscode =
        storeData?.settings?.passcode ||
        defaultStoreData.settings.passcode ||
        'varna2026'
    }

    const isAdmin = isAuthenticated(providedToken || null, expectedPasscode)

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

    const db = await getMongoDb()

    // Determine expected passcode from env, MongoDB, or local config
    let expectedPasscode: string =
      process.env.ADMIN_SECRET_KEY || process.env.ADMIN_PASSCODE || ''

    if (!expectedPasscode) {
      if (db) {
        const existing = await db
          .collection('config')
          .findOne({ _id: 'store_config' as any })
        expectedPasscode =
          existing?.settings?.passcode ||
          defaultStoreData.settings.passcode ||
          'varna2026'
      } else {
        const local = readLocalStore()
        expectedPasscode =
          local?.settings?.passcode ||
          defaultStoreData.settings.passcode ||
          'varna2026'
      }
    }

    // Security Gate: Reject unauthenticated requests
    if (!providedToken || providedToken.trim() !== expectedPasscode.trim()) {
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
    }

    // Also persist to local file if possible (skipped on Vercel)
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
