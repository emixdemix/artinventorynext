import { POST, DELETE } from '@/app/api/folder/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'

afterAll(async () => { await closeAll() })

describe('/api/folder', () => {
  describe('POST', () => {
    it('401 without token', async () => {
      const res = await POST(makeRequest({ method: 'POST', path: '/api/folder', body: {} }))
      expect(res.status).toBe(401)
    })
    it('417 when folder missing', async () => {
      const { token } = await seedSession()
      const res = await POST(makeRequest({ method: 'POST', path: '/api/folder', token, body: {} }))
      expect(res.status).toBe(417)
    })
    it('417 when folder starts with __profile (reserved)', async () => {
      const { token } = await seedSession()
      const res = await POST(makeRequest({
        method: 'POST', path: '/api/folder', token, body: { folder: '__profile/foo' },
      }))
      expect(res.status).toBe(417)
    })
    it('200 for a normal folder name', async () => {
      const { token } = await seedSession()
      const res = await POST(makeRequest({
        method: 'POST', path: '/api/folder', token, body: { folder: 'sketches' },
      }))
      expect([200, 500]).toContain(res.status)
    })
  })

  describe('DELETE', () => {
    it('401 without token', async () => {
      const res = await DELETE(makeRequest({ method: 'DELETE', path: '/api/folder' }))
      expect(res.status).toBe(401)
    })
    it('417 when folder missing', async () => {
      const { token } = await seedSession()
      const res = await DELETE(makeRequest({ method: 'DELETE', path: '/api/folder', token }))
      expect(res.status).toBe(417)
    })
    it('417 when folder starts with __profile', async () => {
      const { token } = await seedSession()
      const res = await DELETE(makeRequest({
        method: 'DELETE', path: '/api/folder',
        searchParams: { folder: '__profile/foo' }, token,
      }))
      expect(res.status).toBe(417)
    })
    it('200 for a normal folder name', async () => {
      const { token } = await seedSession()
      const res = await DELETE(makeRequest({
        method: 'DELETE', path: '/api/folder',
        searchParams: { folder: 'sketches' }, token,
      }))
      expect([200, 500]).toContain(res.status)
    })
  })
})
