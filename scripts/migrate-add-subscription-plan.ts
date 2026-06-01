import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { MongoClient } from 'mongodb'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = resolve(__dirname, '..')

function loadEnvLocal(): void {
  const envPath = resolve(projectRoot, '.env.local')
  if (!existsSync(envPath)) return
  const raw = readFileSync(envPath, 'utf8')
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '')
    if (!(key in process.env)) process.env[key] = value
  }
}

const ARTINVENTORY_DB = 'artinventory'
const USERS_COLLECTION = 'users'

async function main(): Promise<void> {
  loadEnvLocal()

  const uri = (process.env.MONGO_SERVER || 'mongodb://localhost:27017').replace(
    '<PASSWORD>',
    encodeURIComponent(process.env.MONGO_PASSWORD || ''),
  )

  const client = new MongoClient(uri, { connectTimeoutMS: 8000 })
  await client.connect()
  try {
    const db = client.db(ARTINVENTORY_DB)
    const users = db.collection(USERS_COLLECTION)

    const result = await users.updateMany(
      { plan: { $exists: false } },
      { $set: { plan: 'free' } },
    )
    console.log(
      `Backfilled users.plan='free': matched=${result.matchedCount}, modified=${result.modifiedCount}`,
    )
  } finally {
    await client.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
