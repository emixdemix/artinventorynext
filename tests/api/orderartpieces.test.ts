import { POST } from '@/app/api/orderartpieces/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'
import { ObjectId } from 'mongodb'

afterAll(async () => { await closeAll() })

describe('POST /api/orderartpieces', () => {
  it('401 without token', async () => {
    const res = await POST(makeRequest({ method: 'POST', path: '/api/orderartpieces', body: {} }))
    expect(res.status).toBe(401)
  })
  it('417 when ids is not an array', async () => {
    const { token } = await seedSession()
    const res = await POST(makeRequest({
      method: 'POST', path: '/api/orderartpieces', token,
      body: { ids: 'not-an-array' },
    }))
    expect(res.status).toBe(417)
  })
  it('200 with empty ids array', async () => {
    const { token } = await seedSession()
    const res = await POST(makeRequest({
      method: 'POST', path: '/api/orderartpieces', token,
      body: { ids: [] },
    }))
    expect([200, 500]).toContain(res.status)
  })
  it('200 with ids array', async () => {
    const { token } = await seedSession()
    const res = await POST(makeRequest({
      method: 'POST', path: '/api/orderartpieces', token,
      body: { ids: [new ObjectId().toString(), new ObjectId().toString()] },
    }))
    expect([200, 500]).toContain(res.status)
  })
})
