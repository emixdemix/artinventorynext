import { GET, POST } from '@/app/api/feedback/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'

afterAll(async () => { await closeAll() })

describe('/api/feedback', () => {
  describe('GET', () => {
    it('401 without token', async () => {
      const res = await GET(makeRequest({ method: 'GET', path: '/api/feedback' }))
      expect(res.status).toBe(401)
    })
    it('200 with token (id optional)', async () => {
      const { token } = await seedSession()
      const res = await GET(makeRequest({ method: 'GET', path: '/api/feedback', token }))
      expect(res.status).toBe(200)
    })
  })

  describe('POST', () => {
    it('401 without token', async () => {
      const res = await POST(makeRequest({ method: 'POST', path: '/api/feedback', body: {} }))
      expect(res.status).toBe(401)
    })
    it('417 when option missing', async () => {
      const { token } = await seedSession()
      const res = await POST(makeRequest({
        method: 'POST', path: '/api/feedback', token, body: { description: 'd' },
      }))
      expect(res.status).toBe(417)
    })
    it('417 when description missing', async () => {
      const { token } = await seedSession()
      const res = await POST(makeRequest({
        method: 'POST', path: '/api/feedback', token, body: { option: 'bug' },
      }))
      expect(res.status).toBe(417)
    })
    it('200 with both fields', async () => {
      const { token } = await seedSession()
      const res = await POST(makeRequest({
        method: 'POST', path: '/api/feedback', token,
        body: { option: 'bug', description: 'something is broken' },
      }))
      expect(res.status).toBe(200)
    })
  })
})
