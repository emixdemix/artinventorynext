import { GET } from '@/app/api/artpieces/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'

afterAll(async () => { await closeAll() })

describe('GET /api/artpieces', () => {
  it('401 without token', async () => {
    const res = await GET(makeRequest({ method: 'GET', path: '/api/artpieces' }))
    expect(res.status).toBe(401)
  })
  it('200 with token', async () => {
    const { token } = await seedSession()
    const res = await GET(makeRequest({ method: 'GET', path: '/api/artpieces', token }))
    expect(res.status).toBe(200)
  })
})
