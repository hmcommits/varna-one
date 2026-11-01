import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
}

let client: MongoClient | null = null
let clientPromise: Promise<MongoClient> | null = null

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

export function isMongoConfigured(): boolean {
  return Boolean(uri && uri.startsWith('mongodb'))
}

export async function getMongoDb(): Promise<Db | null> {
  if (!isMongoConfigured() || !uri) {
    return null
  }

  try {
    if (process.env.NODE_ENV === 'development') {
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options)
        global._mongoClientPromise = client.connect()
      }
      const connectedClient = await global._mongoClientPromise
      return connectedClient.db('varna_store')
    } else {
      if (!clientPromise) {
        client = new MongoClient(uri, options)
        clientPromise = client.connect()
      }
      const connectedClient = await clientPromise
      return connectedClient.db('varna_store')
    }
  } catch (error) {
    console.error('Failed to connect to MongoDB Atlas:', error)
    return null
  }
}
