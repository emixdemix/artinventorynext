import { GET, POST, DELETE } from '@/app/api/customer/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'
import { ObjectId } from 'mongodb'

afterAll(async () => { await closeAll() })

describe('/api/customer', () => {
  describe('GET', () => {
    it('401 without token', async () => {
      const res = await GET(makeRequest({ method: 'GET', path: '/api/customer' }))
      expect(res.status).toBe(401)
    })
    it('417 when id missing', async () => {
      const { token } = await seedSession()
      const res = await GET(makeRequest({ method: 'GET', path: '/api/customer', token }))
      expect(res.status).toBe(417)
    })
    it('404 when id is unknown', async () => {
      const { token } = await seedSession()
      const res = await GET(makeRequest({
        method: 'GET',
        path: '/api/customer',
        searchParams: { id: new ObjectId().toString() },
        token,
      }))
      expect(res.status).toBe(404)
    })
  })

  describe('POST', () => {
    it('401 without token', async () => {
      const res = await POST(makeRequest({ method: 'POST', path: '/api/customer', body: {} }))
      expect(res.status).toBe(401)
    })
    it('417 when name missing', async () => {
      const { token } = await seedSession()
      const res = await POST(makeRequest({ method: 'POST', path: '/api/customer', token, body: {} }))
      expect(res.status).toBe(417)
    })
    it('200 when creating with name', async () => {
      const { token } = await seedSession()
      const res = await POST(makeRequest({
        method: 'POST',
        path: '/api/customer',
        token,
        body: { name: 'Acme Gallery', email: 'gallery@example.com' },
      }))
      expect(res.status).toBe(200)
    })
  })

  describe('DELETE', () => {
    it('401 without token', async () => {
      const res = await DELETE(makeRequest({ method: 'DELETE', path: '/api/customer' }))
      expect(res.status).toBe(401)
    })
    it('417 when id missing', async () => {
      const { token } = await seedSession()
      const res = await DELETE(makeRequest({ method: 'DELETE', path: '/api/customer', token }))
      expect(res.status).toBe(417)
    })
    it('404 when id is unknown', async () => {
      const { token } = await seedSession()
      const res = await DELETE(makeRequest({
        method: 'DELETE',
        path: '/api/customer',
        searchParams: { id: new ObjectId().toString() },
        token,
      }))
      expect(res.status).toBe(404)
    })
  })
})
