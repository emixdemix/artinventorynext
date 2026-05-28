import { GET, DELETE } from '@/app/api/show/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'
import { ObjectId } from 'mongodb'

afterAll(async () => { await closeAll() })

describe('/api/show', () => {
  describe('GET', () => {
    it('401 without token', async () => {
      const res = await GET(makeRequest({ method: 'GET', path: '/api/show' }))
      expect(res.status).toBe(401)
    })
    it('417 when id missing', async () => {
      const { token } = await seedSession()
      const res = await GET(makeRequest({ method: 'GET', path: '/api/show', token }))
      expect(res.status).toBe(417)
    })
    it('404 when id unknown', async () => {
      const { token } = await seedSession()
      const res = await GET(makeRequest({
        method: 'GET', path: '/api/show',
        searchParams: { id: new ObjectId().toString() }, token,
      }))
      expect(res.status).toBe(404)
    })
  })

  describe('DELETE', () => {
    it('401 without token', async () => {
      const res = await DELETE(makeRequest({ method: 'DELETE', path: '/api/show' }))
      expect(res.status).toBe(401)
    })
    it('417 when id missing', async () => {
      const { token } = await seedSession()
      const res = await DELETE(makeRequest({ method: 'DELETE', path: '/api/show', token }))
      expect(res.status).toBe(417)
    })
    it('404 when id unknown', async () => {
      const { token } = await seedSession()
      const res = await DELETE(makeRequest({
        method: 'DELETE', path: '/api/show',
        searchParams: { id: new ObjectId().toString() }, token,
      }))
      expect(res.status).toBe(404)
    })
  })
})
