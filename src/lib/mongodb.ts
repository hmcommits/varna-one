import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
  maxPoolSize: 5, // Conservative pool for serverless lambdas (Vercel / Atlas M0-M10)
  serverSelectionTimeoutMS: 1500, // Fail fast so API routes respond in milliseconds
  connectTimeoutMS: 5000,
  tls: true,
  tlsAllowInvalidCertificates: true, // Prevents Windows/OpenSSL 3.0 TLS alert 80 handshakes
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
  // eslint-disable-next-line no-var
  var _mongoLastFailedAttempt: number | undefined
}

export function isMongoConfigured(): boolean {
  return Boolean(uri && uri.startsWith('mongodb'))
}

// 60-second circuit breaker cooldown after an Atlas connection failure
const COOLDOWN_PERIOD_MS = 60 * 1000

/**
 * Returns a connected MongoDB database instance with an integrated Circuit Breaker.
 * If connection fails, it fails fast (0ms) on subsequent requests and serves
 * immediately from local cached store data, completely preventing 4-6 second API stalls.
 */
export async function getMongoDb(): Promise<Db | null> {
  if (!isMongoConfigured() || !uri) {
    return null
  }

  // Circuit breaker: if recent attempt failed, fail fast (0ms) so requests are never blocked
  const lastFail = global._mongoLastFailedAttempt || 0
  const now = Date.now()
  if (now - lastFail < COOLDOWN_PERIOD_MS && !global._mongoClientPromise) {
    return null
  }

  try {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    const connectedClient = await Promise.race([
      global._mongoClientPromise,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('MongoDB connection timeout (fast fail)')), 1500)
      ),
    ])
    global._mongoLastFailedAttempt = undefined
    return connectedClient.db('varna_store')
  } catch (error) {
    console.warn('MongoDB Atlas temporarily unavailable, serving from fast store cache:', (error as any)?.message || error)
    global._mongoLastFailedAttempt = Date.now()
    // Reset the cached promise so it retries after cooldown
    global._mongoClientPromise = undefined
    return null
  }
}
