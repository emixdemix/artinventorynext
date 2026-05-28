import { POST, DELETE } from '@/app/api/media/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'
import { ObjectId } from 'mongodb'

afterAll(async () => { await closeAll() })

function fd(fields: Record<string, any>): FormData {
  const form = new FormData()
  for (const [k, v] of Object.entries(fields)) form.append(k, v)
  return form
}

describe('/api/media', () => {
  describe('POST', () => {
    it('401 without token', async () => {
      const res = await POST(makeRequest({ method: 'POST', path: '/api/media', formData: fd({}) }))
      expect(res.status).toBe(401)
    })
    it('417 when name missing', async () => {
      const { token } = await seedSession()
      const file = new Blob([Buffer.from('test')], { type: 'image/png' })
      const res = await POST(makeRequest({
        method: 'POST', path: '/api/media', token,
        formData: fd({ document: file }),
      }))
      expect(res.status).toBe(417)
    })
    it('417 when document missing', async () => {
      const { token } = await seedSession()
      const res = await POST(makeRequest({
        method: 'POST', path: '/api/media', token,
        formData: fd({ name: 'pic' }),
      }))
      expect(res.status).toBe(417)
    })
  })

  describe('DELETE', () => {
    it('401 without token', async () => {
      const res = await DELETE(makeRequest({ method: 'DELETE', path: '/api/media' }))
      expect(res.status).toBe(401)
    })
    it('417 when mediaId missing', async () => {
      const { token } = await seedSession()
      const res = await DELETE(makeRequest({ method: 'DELETE', path: '/api/media', token }))
      expect(res.status).toBe(417)
    })
    it('404 when mediaId unknown', async () => {
      const { token } = await seedSession()
      const res = await DELETE(makeRequest({
        method: 'DELETE', path: '/api/media',
        searchParams: { mediaId: new ObjectId().toString() }, token,
      }))
      expect(res.status).toBe(404)
    })
  })
})
