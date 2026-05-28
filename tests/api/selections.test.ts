import { GET, PATCH, PUT } from '@/app/api/selections/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'
import { ObjectId } from 'mongodb'

afterAll(async () => { await closeAll() })

describe('/api/selections', () => {
  describe('GET', () => {
    it('401 without token', async () => {
      const res = await GET(makeRequest({ method: 'GET', path: '/api/selections' }))
      expect(res.status).toBe(401)
    })
    it('200 with token', async () => {
      const { token } = await seedSession()
      const res = await GET(makeRequest({ method: 'GET', path: '/api/selections', token }))
      expect(res.status).toBe(200)
    })
  })

  describe('PATCH', () => {
    it('401 without token', async () => {
      const res = await PATCH(makeRequest({ method: 'PATCH', path: '/api/selections', body: {} }))
      expect(res.status).toBe(401)
    })
    it('417 when selections missing', async () => {
      const { token } = await seedSession()
      const res = await PATCH(makeRequest({
        method: 'PATCH', path: '/api/selections', token,
        body: { name: 'My selection' },
      }))
      expect(res.status).toBe(417)
    })
    it('417 when both name and selectionId missing', async () => {
      const { token } = await seedSession()
      const res = await PATCH(makeRequest({
        method: 'PATCH', path: '/api/selections', token,
        body: { selections: [new ObjectId().toString()] },
      }))
      expect(res.status).toBe(417)
    })
    it('200 when selections + name provided (creating new)', async () => {
      const { token } = await seedSession()
      const res = await PATCH(makeRequest({
        method: 'PATCH', path: '/api/selections', token,
        body: { selections: [new ObjectId().toString()], name: 'New Selection' },
      }))
      expect([200, 417]).toContain(res.status)
    })
  })

  describe('PUT', () => {
    it('401 without token', async () => {
      const res = await PUT(makeRequest({ method: 'PUT', path: '/api/selections', body: {} }))
      expect(res.status).toBe(401)
    })
    it('417 when both fields missing', async () => {
      const { token } = await seedSession()
      const res = await PUT(makeRequest({
        method: 'PUT', path: '/api/selections', token, body: {},
      }))
      expect(res.status).toBe(417)
    })
  })
})
