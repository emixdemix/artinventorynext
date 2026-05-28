import { GET, PATCH, DELETE } from '@/app/api/selection/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'
import { ObjectId } from 'mongodb'

afterAll(async () => { await closeAll() })

describe('/api/selection', () => {
  describe('GET', () => {
    it('401 without token', async () => {
      const res = await GET(makeRequest({ method: 'GET', path: '/api/selection' }))
      expect(res.status).toBe(401)
    })
    it('417 when id missing', async () => {
      const { token } = await seedSession()
      const res = await GET(makeRequest({ method: 'GET', path: '/api/selection', token }))
      expect(res.status).toBe(417)
    })
    it('200 with valid id (likely empty result)', async () => {
      const { token } = await seedSession()
      const res = await GET(makeRequest({
        method: 'GET', path: '/api/selection',
        searchParams: { id: new ObjectId().toString() }, token,
      }))
      expect(res.status).toBe(200)
    })
  })

  describe('PATCH', () => {
    it('401 without token', async () => {
      const res = await PATCH(makeRequest({ method: 'PATCH', path: '/api/selection', body: {} }))
      expect(res.status).toBe(401)
    })
    it('417 when selectionId missing', async () => {
      const { token } = await seedSession()
      const res = await PATCH(makeRequest({
        method: 'PATCH', path: '/api/selection', token,
        body: { ids: [new ObjectId().toString()] },
      }))
      expect(res.status).toBe(417)
    })
    it('417 when ids missing', async () => {
      const { token } = await seedSession()
      const res = await PATCH(makeRequest({
        method: 'PATCH', path: '/api/selection', token,
        body: { selectionId: new ObjectId().toString() },
      }))
      expect(res.status).toBe(417)
    })
  })

  describe('DELETE', () => {
    it('401 without token', async () => {
      const res = await DELETE(makeRequest({ method: 'DELETE', path: '/api/selection' }))
      expect(res.status).toBe(401)
    })
    it('417 when id missing', async () => {
      const { token } = await seedSession()
      const res = await DELETE(makeRequest({ method: 'DELETE', path: '/api/selection', token }))
      expect(res.status).toBe(417)
    })
    it('404 when id unknown', async () => {
      const { token } = await seedSession()
      const res = await DELETE(makeRequest({
        method: 'DELETE', path: '/api/selection',
        searchParams: { id: new ObjectId().toString() }, token,
      }))
      expect(res.status).toBe(404)
    })
  })
})
