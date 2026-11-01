import { NextResponse } from 'next/server'
import { getMongoDb } from '@/lib/mongodb'
import { defaultStoreData } from '@/data/defaultStoreData'
import fs from 'fs'
import path from 'path'
import { StoreState } from '@/types/store'

const LOCAL_STORE_FILE = path.join(process.cwd(), 'src', 'data', 'store.json')

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

export async function GET() {
  try {
    const db = await getMongoDb()

    if (db) {
      const config = await db.collection('config').findOne({ _id: 'store_config' as any })
      if (config) {
        // remove mongo internal _id
        const { _id: _, ...storeData } = config
        return NextResponse.json(storeData, {
          headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59' },
        })
      } else {
        // Seed MongoDB Atlas on first connect
        const initialData = readLocalStore() || defaultStoreData
        await db.collection('config').updateOne(
          { _id: 'store_config' as any },
          { $set: { ...initialData, _id: 'store_config' } },
          { upsert: true }
        )
        return NextResponse.json(initialData, {
          headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=59' },
        })
      }
    }

    // Fallback to local store.json or defaultStoreData
    const local = readLocalStore()
    if (local) {
      return NextResponse.json(local)
    }

    return NextResponse.json(defaultStoreData)
  } catch (err) {
    console.error('Error fetching store state:', err)
    return NextResponse.json(defaultStoreData)
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

    // Also persist to local file if possible
    writeLocalStore(body)

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
