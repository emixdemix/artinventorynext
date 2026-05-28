import { GET } from '@/app/api/categories/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'

afterAll(async () => { await closeAll() })

describe('GET /api/categories', () => {
  it('401 without token', async () => {
    const res = await GET(makeRequest({ method: 'GET', path: '/api/categories' }))
    expect(res.status).toBe(401)
  })
  it('200 with token, no type', async () => {
    const { token } = await seedSession()
    const res = await GET(makeRequest({ method: 'GET', path: '/api/categories', token }))
    expect(res.status).toBe(200)
  })
  it('200 with token and type=all', async () => {
    const { token } = await seedSession()
    const res = await GET(makeRequest({
      method: 'GET',
      path: '/api/categories',
      searchParams: { type: 'all' },
      token,
    }))
    expect(res.status).toBe(200)
  })
})
