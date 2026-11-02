import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
  maxPoolSize: 5, // Conservative pool for serverless lambdas (Vercel / Atlas M0-M10)
  serverSelectionTimeoutMS: 5000, // 5000ms gives serverless cold starts plenty of time
  connectTimeoutMS: 8000,
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

// 45-second circuit breaker cooldown after an Atlas connection failure
const COOLDOWN_PERIOD_MS = 45 * 1000

/**
 * Returns a connected MongoDB database instance.
 * @param timeoutMs Maximum wait time before failing fast. Defaults to 5000ms.
 */
export async function getMongoDb(timeoutMs = 5000): Promise<Db | null> {
  if (!isMongoConfigured() || !uri) {
    return null
  }

  // Circuit breaker: only skip for quick read requests (timeout <= 2000)
  const lastFail = global._mongoLastFailedAttempt || 0
  const now = Date.now()
  if (timeoutMs <= 2000 && now - lastFail < COOLDOWN_PERIOD_MS && !global._mongoClientPromise) {
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
        setTimeout(() => reject(new Error('MongoDB connection timeout')), timeoutMs)
      ),
    ])
    global._mongoLastFailedAttempt = undefined
    return connectedClient.db('varna_store')
  } catch (error) {
    console.warn('MongoDB Atlas temporarily unavailable:', (error as any)?.message || error)
    global._mongoLastFailedAttempt = Date.now()
    // Reset the cached promise so it retries after cooldown
    global._mongoClientPromise = undefined
    return null
  }
}
