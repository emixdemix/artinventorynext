import { GET } from '@/app/api/validsession/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'

afterAll(async () => { await closeAll() })

describe('GET /api/validsession', () => {
  it('returns 401 without token', async () => {
    const res = await GET(makeRequest({ method: 'GET', path: '/api/validsession' }))
    expect(res.status).toBe(401)
  })

  it('returns 200 with a valid token', async () => {
    const { token } = await seedSession()
    const res = await GET(makeRequest({ method: 'GET', path: '/api/validsession', token }))
    expect(res.status).toBe(200)
  })
})
