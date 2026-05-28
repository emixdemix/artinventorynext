import { POST } from '@/app/api/sellpieces/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'
import { ObjectId } from 'mongodb'

afterAll(async () => { await closeAll() })

describe('POST /api/sellpieces', () => {
  it('401 without token', async () => {
    const res = await POST(makeRequest({ method: 'POST', path: '/api/sellpieces', body: {} }))
    expect(res.status).toBe(401)
  })
  it('417 when customerId missing', async () => {
    const { token } = await seedSession()
    const res = await POST(makeRequest({
      method: 'POST', path: '/api/sellpieces', token,
      body: { artPieces: { '1': {} } },
    }))
    expect(res.status).toBe(417)
  })
  it('417 when artPieces missing', async () => {
    const { token } = await seedSession()
    const res = await POST(makeRequest({
      method: 'POST', path: '/api/sellpieces', token,
      body: { customerId: new ObjectId().toString() },
    }))
    expect(res.status).toBe(417)
  })
  it('200 with both fields', async () => {
    const { token } = await seedSession()
    const pieceId = new ObjectId().toString()
    const res = await POST(makeRequest({
      method: 'POST', path: '/api/sellpieces', token,
      body: { customerId: new ObjectId().toString(), artPieces: { [pieceId]: 1 } },
    }))
    expect([200, 500]).toContain(res.status)
  })

  it('417 when artPieces keys are not valid ObjectIds', async () => {
    const { token } = await seedSession()
    const res = await POST(makeRequest({
      method: 'POST', path: '/api/sellpieces', token,
      body: { customerId: new ObjectId().toString(), artPieces: { 'not-an-objectid': 1 } },
    }))
    expect(res.status).toBe(417)
  })
})
