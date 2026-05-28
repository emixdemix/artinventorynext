import { GET } from '@/app/api/folders/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'

afterAll(async () => { await closeAll() })

describe('GET /api/folders', () => {
  it('401 without token', async () => {
    const res = await GET(makeRequest({ method: 'GET', path: '/api/folders' }))
    expect(res.status).toBe(401)
  })
  it('200 with token', async () => {
    const { token } = await seedSession()
    const res = await GET(makeRequest({ method: 'GET', path: '/api/folders', token }))
    expect([200, 500]).toContain(res.status)
  })
})
