import { GET } from '@/app/api/download/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'

afterAll(async () => { await closeAll() })

describe('GET /api/download', () => {
  it('401 without token', async () => {
    const res = await GET(makeRequest({ method: 'GET', path: '/api/download' }))
    expect(res.status).toBe(401)
  })
  it('417 when type missing', async () => {
    const { token } = await seedSession()
    const res = await GET(makeRequest({ method: 'GET', path: '/api/download', token }))
    expect(res.status).toBe(417)
  })
  it('417 with invalid type', async () => {
    const { token } = await seedSession()
    const res = await GET(makeRequest({
      method: 'GET', path: '/api/download',
      searchParams: { type: 'bogus' }, token,
    }))
    expect(res.status).toBe(417)
  })
  it('501 for images type (not implemented)', async () => {
    const { token } = await seedSession()
    const res = await GET(makeRequest({
      method: 'GET', path: '/api/download',
      searchParams: { type: 'images' }, token,
    }))
    expect([501, 404]).toContain(res.status)
  })
  it('returns 200/404 for data type', async () => {
    const { token } = await seedSession()
    const res = await GET(makeRequest({
      method: 'GET', path: '/api/download',
      searchParams: { type: 'data' }, token,
    }))
    expect([200, 404]).toContain(res.status)
  })
})
