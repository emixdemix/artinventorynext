import { GET } from '@/app/api/artpiecesale/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'

afterAll(async () => { await closeAll() })

describe('GET /api/artpiecesale', () => {
  it('401 without token', async () => {
    const res = await GET(makeRequest({ method: 'GET', path: '/api/artpiecesale' }))
    expect(res.status).toBe(401)
  })
  it('200 with token', async () => {
    const { token } = await seedSession()
    const res = await GET(makeRequest({ method: 'GET', path: '/api/artpiecesale', token }))
    expect(res.status).toBe(200)
  })
})
