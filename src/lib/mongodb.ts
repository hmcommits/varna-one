import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
  maxPoolSize: 5, // Conservative pool for serverless lambdas (Vercel / Atlas M0-M10)
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

export function isMongoConfigured(): boolean {
  return Boolean(uri && uri.startsWith('mongodb'))
}

/**
 * Returns a connected MongoDB database instance.
 * Uses `global._mongoClientPromise` universally (dev + production) so that
 * Vercel serverless lambda warm containers reuse the same connection across
 * invocations instead of spawning new connections on every request.
 */
export async function getMongoDb(): Promise<Db | null> {
  if (!isMongoConfigured() || !uri) {
    return null
  }

  try {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    const connectedClient = await global._mongoClientPromise
    return connectedClient.db('varna_store')
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas:', error)
    // Reset the cached promise so the next request retries connection
    global._mongoClientPromise = undefined
    return null
  }
}
