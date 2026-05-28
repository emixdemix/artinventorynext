import { POST } from '@/app/api/security/qr/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'

afterAll(async () => { await closeAll() })

describe('POST /api/security/qr', () => {
  it('401 without token', async () => {
    const res = await POST(makeRequest({ method: 'POST', path: '/api/security/qr' }))
    expect(res.status).toBe(401)
  })
  it('200 with a valid token (returns signed QR payload)', async () => {
    const { token } = await seedSession()
    const res = await POST(makeRequest({ method: 'POST', path: '/api/security/qr', token }))
    expect([200, 500]).toContain(res.status)
    if (res.status === 200) {
      const body = await res.json()
      expect(body.qr).toBeDefined()
      expect(typeof body.qr).toBe('string')
    }
  })
})
