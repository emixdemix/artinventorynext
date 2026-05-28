import { MongoClient } from 'mongodb'

export default async function globalTeardown() {
  require('./load-env')

  if (process.env.KEEP_TEST_DB === '1') return

  const rawUri = process.env.TEST_MONGO_SERVER || process.env.MONGO_SERVER || 'mongodb://localhost:27017'
  const password = process.env.TEST_MONGO_PASSWORD || process.env.MONGO_PASSWORD || ''
  const uri = rawUri.replace('<PASSWORD>', encodeURIComponent(password))
  const dbName = process.env.MONGO_TEST_DB || 'artinventory_test'

  const client = new MongoClient(uri, { connectTimeoutMS: 5000 })
  await client.connect()
  await client.db(dbName).dropDatabase().catch(() => undefined)
  await client.close()
}
