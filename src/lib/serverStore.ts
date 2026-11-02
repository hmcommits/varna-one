import fs from 'fs'
import path from 'path'
import { getMongoDb } from '@/lib/mongodb'
import { defaultStoreData } from '@/data/defaultStoreData'
import { StoreState, Product } from '@/types/store'

const LOCAL_STORE_FILE = path.join(process.cwd(), 'src', 'data', 'store.json')

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`
  }
  return 'https://varnaclothingin.in'
}

function readLocalStore(): StoreState | null {
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      const data = fs.readFileSync(LOCAL_STORE_FILE, 'utf-8')
      return JSON.parse(data)
    }
  } catch {
    // Fall back to defaultStoreData
  }
  return null
}

export async function getStoreDataForServer(): Promise<StoreState> {
  try {
    const db = await getMongoDb(2000)
    if (db) {
      const config = await db.collection('config').findOne({ _id: 'store_config' as any })
      if (config) {
        return config as unknown as StoreState
      }
    }
  } catch {
    // MongoDB unavailable, proceed to local/default fallback
  }

  const local = readLocalStore()
  if (local) return local

  return defaultStoreData
}

export async function getAllProducts(): Promise<Product[]> {
  const store = await getStoreDataForServer()
  return store.products || []
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getAllProducts()
  const found = products.find((p) => p.id === id)
  if (found) return found

  // Also check defaultStoreData in case custom id isn't in store yet
  const fallback = (defaultStoreData.products || []).find((p) => p.id === id)
  return fallback || null
}
