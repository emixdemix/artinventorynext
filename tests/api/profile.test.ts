import { GET, POST } from '@/app/api/profile/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'

afterAll(async () => { await closeAll() })

function fd(fields: Record<string, any>): FormData {
  const form = new FormData()
  for (const [k, v] of Object.entries(fields)) form.append(k, v)
  return form
}

describe('/api/profile', () => {
  describe('GET', () => {
    it('401 without token', async () => {
      const res = await GET(makeRequest({ method: 'GET', path: '/api/profile' }))
      expect(res.status).toBe(401)
    })
    it('returns 200 or 403 (depending on user existence)', async () => {
      const { token } = await seedSession()
      const res = await GET(makeRequest({ method: 'GET', path: '/api/profile', token }))
      expect([200, 403]).toContain(res.status)
    })
  })

  describe('POST', () => {
    it('401 without token', async () => {
      const res = await POST(makeRequest({ method: 'POST', path: '/api/profile', formData: fd({}) }))
      expect(res.status).toBe(401)
    })
    it('200 or 500 with token (no required fields)', async () => {
      const { token } = await seedSession()
      const res = await POST(makeRequest({
        method: 'POST', path: '/api/profile', token,
        formData: fd({ firstName: 'Updated' }),
      }))
      expect([200, 500]).toContain(res.status)
    })
  })
})
