import { GET } from '@/app/api/customers/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'

afterAll(async () => { await closeAll() })

describe('GET /api/customers', () => {
  it('401 without token', async () => {
    const res = await GET(makeRequest({ method: 'GET', path: '/api/customers' }))
    expect(res.status).toBe(401)
  })

  it('returns 200 or 404 with valid token', async () => {
    const { token } = await seedSession()
    const res = await GET(makeRequest({ method: 'GET', path: '/api/customers', token }))
    expect([200, 404]).toContain(res.status)
  })
})
