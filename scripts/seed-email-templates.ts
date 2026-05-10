import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { MongoClient } from 'mongodb'
import { renderedTemplates } from '../src/server/email/templates/index.ts'

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
const TEMPLATES_COLLECTION = 'templates'

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run')
  loadEnvLocal()

  if (dryRun) {
    const outDir = resolve(projectRoot, 'tmp/email-preview')
    mkdirSync(outDir, { recursive: true })
    for (const t of renderedTemplates) {
      const filePath = resolve(outDir, `${t.name}.html`)
      writeFileSync(filePath, t.html, 'utf8')
      const hasUrl = t.html.includes('{{url}}')
      const hasCode = t.html.includes('{{code}}')
      console.log(
        `[dry-run] ${t.name.padEnd(18)} ${String(t.html.length).padStart(6)} bytes  ` +
          `url=${hasUrl ? 'yes' : 'no '} code=${hasCode ? 'yes' : 'no '}  → ${filePath}`,
      )
    }
    console.log(`\nWrote ${renderedTemplates.length} preview files to ${outDir}`)
    return
  }

  const uri = (process.env.MONGO_SERVER || 'mongodb://localhost:27017').replace(
    '<PASSWORD>',
    encodeURIComponent(process.env.MONGO_PASSWORD || ''),
  )

  const client = new MongoClient(uri, { connectTimeoutMS: 8000 })
  await client.connect()
  try {
    const db = client.db(ARTINVENTORY_DB)
    const collection = db.collection(TEMPLATES_COLLECTION)

    for (const t of renderedTemplates) {
      const previous = await collection.findOne({ name: t.name })
      const oldBytes = previous?.html?.length ?? 0
      await collection.replaceOne(
        { name: t.name },
        { name: t.name, html: t.html },
        { upsert: true },
      )
      console.log(
        `${t.name.padEnd(18)} ${String(oldBytes).padStart(6)} → ${String(t.html.length).padStart(6)} bytes`,
      )
    }
    console.log(`\nUpserted ${renderedTemplates.length} templates.`)
  } finally {
    await client.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
