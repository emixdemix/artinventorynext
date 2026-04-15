import { MongoClient } from 'mongodb'

export const ARTINVENTORY_DB = 'artinventory'
export const ARTPIECES_COLLECTION = 'artpieces'
export const PICTURES_COLLECTION = 'pictures'
export const CATEGORIES_COLLECTION = 'categories'
export const CUSTOMER_COLLECTION = 'customers'
export const SELECTIONS_COLLECTION = 'selections'
export const FEEDBACKS_COLLECTION = 'feedbacks'
export const REPORTS_COLLECTION = 'reports'
export const SHOWS_COLLECTION = 'shows'
export const TRANSLATIONS_COLLECTION = 'translations'
export const LOGINS_COLLECTION = 'logins'
export const USERS_COLLECTION = 'users'
export const REDIS_COLLECTION = 'redis'
export const TEMPLATES_COLLECTION = 'templates'

// Singleton pattern for Next.js (survives hot reloads in dev)
const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>
}

export async function getDbClient(): Promise<MongoClient> {
  if (globalForMongo._mongoClientPromise) {
    return globalForMongo._mongoClientPromise
  }

  const uri = (process.env.MONGO_SERVER || 'mongodb://localhost:27017')
    .replace('<PASSWORD>', encodeURIComponent(process.env.MONGO_PASSWORD || ''))

  const client = new MongoClient(uri, {
    connectTimeoutMS: 5000,
  })

  globalForMongo._mongoClientPromise = client.connect()
  return globalForMongo._mongoClientPromise
}
