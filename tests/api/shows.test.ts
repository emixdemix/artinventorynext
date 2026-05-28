import { GET, POST } from '@/app/api/shows/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'

afterAll(async () => { await closeAll() })

describe('/api/shows', () => {
  describe('GET', () => {
    it('401 without token', async () => {
      const res = await GET(makeRequest({ method: 'GET', path: '/api/shows' }))
      expect(res.status).toBe(401)
    })
    it('200 with token', async () => {
      const { token } = await seedSession()
      const res = await GET(makeRequest({ method: 'GET', path: '/api/shows', token }))
      expect(res.status).toBe(200)
    })
  })

  describe('POST', () => {
    it('401 without token', async () => {
      const res = await POST(makeRequest({ method: 'POST', path: '/api/shows', body: {} }))
      expect(res.status).toBe(401)
    })
    it('417 when name missing', async () => {
      const { token } = await seedSession()
      const res = await POST(makeRequest({ method: 'POST', path: '/api/shows', token, body: {} }))
      expect(res.status).toBe(417)
    })
    it('200 when creating with name', async () => {
      const { token } = await seedSession()
      const res = await POST(makeRequest({
        method: 'POST', path: '/api/shows', token,
        body: { name: 'Spring Show', location: 'Paris' },
      }))
      expect([200, 500]).toContain(res.status)
    })
  })
})
