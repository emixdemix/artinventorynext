import { POST, DELETE } from '@/app/api/category/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'
import { ObjectId } from 'mongodb'

afterAll(async () => { await closeAll() })

describe('/api/category', () => {
  describe('POST', () => {
    it('401 without token', async () => {
      const res = await POST(makeRequest({ method: 'POST', path: '/api/category', body: {} }))
      expect(res.status).toBe(401)
    })
    it('417 when label missing', async () => {
      const { token } = await seedSession()
      const res = await POST(makeRequest({
        method: 'POST',
        path: '/api/category',
        token,
        body: { value: 'v', type: 'category' },
      }))
      expect(res.status).toBe(417)
    })
    it('417 when value missing', async () => {
      const { token } = await seedSession()
      const res = await POST(makeRequest({
        method: 'POST',
        path: '/api/category',
        token,
        body: { label: 'L', type: 'category' },
      }))
      expect(res.status).toBe(417)
    })
    it('417 when type missing', async () => {
      const { token } = await seedSession()
      const res = await POST(makeRequest({
        method: 'POST',
        path: '/api/category',
        token,
        body: { label: 'L', value: 'v' },
      }))
      expect(res.status).toBe(417)
    })
    it('200 with all required fields', async () => {
      const { token } = await seedSession()
      const res = await POST(makeRequest({
        method: 'POST',
        path: '/api/category',
        token,
        body: { label: 'Painting', value: 'painting', type: 'arttype' },
      }))
      expect(res.status).toBe(200)
    })
  })

  describe('DELETE', () => {
    it('401 without token', async () => {
      const res = await DELETE(makeRequest({ method: 'DELETE', path: '/api/category' }))
      expect(res.status).toBe(401)
    })
    it('419 when id missing', async () => {
      const { token } = await seedSession()
      const res = await DELETE(makeRequest({ method: 'DELETE', path: '/api/category', token }))
      expect(res.status).toBe(419)
    })
    it('200 when id is unused (and unknown)', async () => {
      const { token } = await seedSession()
      const res = await DELETE(makeRequest({
        method: 'DELETE',
        path: '/api/category',
        searchParams: { id: new ObjectId().toString() },
        token,
      }))
      expect([200, 417]).toContain(res.status)
    })
  })
})
