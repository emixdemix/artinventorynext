import { POST } from '@/app/api/movemedia/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'
import { ObjectId } from 'mongodb'

afterAll(async () => { await closeAll() })

describe('POST /api/movemedia', () => {
  it('401 without token', async () => {
    const res = await POST(makeRequest({ method: 'POST', path: '/api/movemedia', body: {} }))
    expect(res.status).toBe(401)
  })
  it('417 when destination missing', async () => {
    const { token } = await seedSession()
    const res = await POST(makeRequest({
      method: 'POST', path: '/api/movemedia', token,
      body: { mediaId: new ObjectId().toString() },
    }))
    expect(res.status).toBe(417)
  })
  it('417 when mediaId missing', async () => {
    const { token } = await seedSession()
    const res = await POST(makeRequest({
      method: 'POST', path: '/api/movemedia', token,
      body: { destination: 'sketches' },
    }))
    expect(res.status).toBe(417)
  })
  it('417 when destination starts with __profile', async () => {
    const { token } = await seedSession()
    const res = await POST(makeRequest({
      method: 'POST', path: '/api/movemedia', token,
      body: { destination: '__profile/x', mediaId: new ObjectId().toString() },
    }))
    expect(res.status).toBe(417)
  })
  it('404 when mediaId unknown', async () => {
    const { token } = await seedSession()
    const res = await POST(makeRequest({
      method: 'POST', path: '/api/movemedia', token,
      body: { destination: 'sketches', mediaId: new ObjectId().toString() },
    }))
    expect(res.status).toBe(404)
  })
})
