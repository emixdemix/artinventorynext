import fs from 'fs'
import path from 'path'

const envPath = path.resolve(__dirname, '../../.env.local')
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = value
  }
}

process.env.NEXT_RUNTIME = 'nodejs'
process.env.MONGO_TEST_DB = process.env.MONGO_TEST_DB || 'artinventory_test'
// Force the real connection.ts (used by db/session.ts via './connection') to
// target the test DB, so validateToken reads sessions from the same place
// the test helpers seeded them.
process.env.MONGO_DB_NAME = process.env.MONGO_TEST_DB
