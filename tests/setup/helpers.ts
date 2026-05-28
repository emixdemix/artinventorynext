import { ObjectId } from 'mongodb'
import { randomUUID } from 'crypto'
import { NextRequest } from 'next/server'
import {
  ARTINVENTORY_DB,
  REDIS_COLLECTION,
  USERS_COLLECTION,
  getDbClient,
} from '@/server/db/connection'

export const TEST_USER_EMAIL = 'tester@example.com'

export interface SeededSession {
  token: string
  userId: ObjectId
  user: { _id: ObjectId; email: string; firstName: string; lastName: string }
}

let cached: SeededSession | null = null

export async function seedSession(): Promise<SeededSession> {
  if (cached) return cached

  const client = await getDbClient()
  const db = client.db(ARTINVENTORY_DB)
  const users = db.collection(USERS_COLLECTION)
  const redis = db.collection(REDIS_COLLECTION)

  const existing = await users.findOne({ email: TEST_USER_EMAIL })
  let userDoc
  if (existing) {
    userDoc = existing
  } else {
    const insert = await users.insertOne({
      email: TEST_USER_EMAIL,
      firstName: 'Test',
      lastName: 'User',
      createdAt: new Date(),
    } as any)
    userDoc = { _id: insert.insertedId, email: TEST_USER_EMAIL, firstName: 'Test', lastName: 'User' } as any
  }

  const token = randomUUID()
  await redis.insertOne({
    key: token,
    data: {
      _id: userDoc._id,
      email: userDoc.email,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
      verifiedEmail: true,
    },
    timetolive: Date.now() + 3600 * 1000,
  } as any)

  cached = {
    token,
    userId: userDoc._id,
    user: {
      _id: userDoc._id,
      email: userDoc.email,
      firstName: userDoc.firstName,
      lastName: userDoc.lastName,
    },
  }
  return cached
}

export interface MakeRequestOpts {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  path?: string
  searchParams?: Record<string, string>
  body?: any
  formData?: FormData
  token?: string | null
  headers?: Record<string, string>
}

export function makeRequest(opts: MakeRequestOpts = {}): NextRequest {
  const { method = 'GET', path = '/api/test', searchParams, body, formData, token, headers = {} } = opts
  const url = new URL(`http://localhost${path}`)
  if (searchParams) {
    for (const [k, v] of Object.entries(searchParams)) url.searchParams.set(k, v)
  }

  const init: RequestInit = { method }
  const allHeaders: Record<string, string> = { ...headers }
  if (token) allHeaders['X-Token'] = token

  if (formData) {
    init.body = formData as any
  } else if (body !== undefined) {
    allHeaders['Content-Type'] = allHeaders['Content-Type'] || 'application/json'
    init.body = typeof body === 'string' ? body : JSON.stringify(body)
  }
  init.headers = allHeaders

  return new NextRequest(url.toString(), init as any)
}

export async function clearCollection(name: string) {
  const client = await getDbClient()
  await client.db(ARTINVENTORY_DB).collection(name).deleteMany({})
}

// No-op: the Mongo client is a process-wide singleton (cached on globalThis)
// shared by routes and the test helpers. Closing it per test file would
// invalidate the cached client for the next file. The global teardown closes
// it once when the run ends.
export async function closeAll() {
  cached = null
}
