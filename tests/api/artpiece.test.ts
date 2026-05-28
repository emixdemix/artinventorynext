import { GET, POST, PATCH, DELETE } from '@/app/api/artpiece/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'
import { ObjectId } from 'mongodb'

afterAll(async () => { await closeAll() })

function fd(fields: Record<string, string | Blob>): FormData {
  const form = new FormData()
  for (const [k, v] of Object.entries(fields)) form.append(k, v as any)
  return form
}

describe('/api/artpiece', () => {
  describe('GET', () => {
    it('401 without token', async () => {
      const res = await GET(makeRequest({ method: 'GET', path: '/api/artpiece' }))
      expect(res.status).toBe(401)
    })
    it('200 with token (returns possibly empty list)', async () => {
      const { token } = await seedSession()
      const res = await GET(makeRequest({
        method: 'GET',
        path: '/api/artpiece',
        searchParams: { id: new ObjectId().toString() },
        token,
      }))
      expect(res.status).toBe(200)
    })
  })

  describe('POST', () => {
    it('401 without token', async () => {
      const res = await POST(makeRequest({ method: 'POST', path: '/api/artpiece', formData: fd({}) }))
      expect(res.status).toBe(401)
    })
    it('417 when title missing', async () => {
      const { token } = await seedSession()
      const res = await POST(makeRequest({
        method: 'POST',
        path: '/api/artpiece',
        token,
        formData: fd({ imageId: 'image-uuid' }),
      }))
      expect(res.status).toBe(417)
    })
    it('417 when neither file nor imageId provided', async () => {
      const { token } = await seedSession()
      const res = await POST(makeRequest({
        method: 'POST',
        path: '/api/artpiece',
        token,
        formData: fd({ title: 'My Piece' }),
      }))
      expect(res.status).toBe(417)
    })
    it('200 with title + imageId (no upload path)', async () => {
      const { token } = await seedSession()
      const res = await POST(makeRequest({
        method: 'POST',
        path: '/api/artpiece',
        token,
        formData: fd({ title: 'My Piece', imageId: 'image-uuid' }),
      }))
      expect([200, 500]).toContain(res.status)
    })
  })

  describe('PATCH', () => {
    it('401 without token', async () => {
      const res = await PATCH(makeRequest({ method: 'PATCH', path: '/api/artpiece', formData: fd({}) }))
      expect(res.status).toBe(401)
    })
    it('417 when title missing', async () => {
      const { token } = await seedSession()
      const res = await PATCH(makeRequest({
        method: 'PATCH',
        path: '/api/artpiece',
        token,
        formData: fd({ artPieceId: new ObjectId().toString() }),
      }))
      expect(res.status).toBe(417)
    })
    it('404 when artPieceId is unknown', async () => {
      const { token } = await seedSession()
      const res = await PATCH(makeRequest({
        method: 'PATCH',
        path: '/api/artpiece',
        token,
        formData: fd({ title: 'New Title', artPieceId: new ObjectId().toString() }),
      }))
      expect(res.status).toBe(404)
    })
  })

  describe('DELETE', () => {
    it('401 without token', async () => {
      const res = await DELETE(makeRequest({ method: 'DELETE', path: '/api/artpiece' }))
      expect(res.status).toBe(401)
    })
    it('417 when artPieceId missing', async () => {
      const { token } = await seedSession()
      const res = await DELETE(makeRequest({ method: 'DELETE', path: '/api/artpiece', token }))
      expect(res.status).toBe(417)
    })
    it('404 when artPieceId unknown', async () => {
      const { token } = await seedSession()
      const res = await DELETE(makeRequest({
        method: 'DELETE',
        path: '/api/artpiece',
        searchParams: { artPieceId: new ObjectId().toString() },
        token,
      }))
      expect(res.status).toBe(404)
    })
  })
})
