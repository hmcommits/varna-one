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
        return NextResponse.json(storeData)
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
    const body: StoreState = await req.json()
    body.lastUpdated = new Date().toISOString()

    const db = await getMongoDb()
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
