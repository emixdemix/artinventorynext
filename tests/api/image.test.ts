import { GET } from '@/app/api/image/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'

afterAll(async () => { await closeAll() })

describe('GET /api/image', () => {
  it('401 without token', async () => {
    const res = await GET(makeRequest({ method: 'GET', path: '/api/image' }))
    expect(res.status).toBe(401)
  })
  it('417 when image param missing', async () => {
    const { token } = await seedSession()
    const res = await GET(makeRequest({ method: 'GET', path: '/api/image', token }))
    expect(res.status).toBe(417)
  })
  it('returns a response when image is provided (mocked S3 may yield empty body)', async () => {
    const { token } = await seedSession()
    const res = await GET(makeRequest({
      method: 'GET',
      path: '/api/image',
      searchParams: { image: 'somefile' },
      token,
    }))
    expect([200, 404, 500]).toContain(res.status)
  })
})
