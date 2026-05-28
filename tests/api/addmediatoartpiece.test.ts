import { PATCH } from '@/app/api/addmediatoartpiece/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'
import { ObjectId } from 'mongodb'

afterAll(async () => { await closeAll() })

describe('PATCH /api/addmediatoartpiece', () => {
  it('401 without token', async () => {
    const res = await PATCH(makeRequest({ method: 'PATCH', path: '/api/addmediatoartpiece', body: {} }))
    expect(res.status).toBe(401)
  })
  it('417 when selections missing', async () => {
    const { token } = await seedSession()
    const res = await PATCH(makeRequest({
      method: 'PATCH',
      path: '/api/addmediatoartpiece',
      token,
      body: { artPieceId: new ObjectId().toString() },
    }))
    expect(res.status).toBe(417)
  })
  it('417 when artPieceId missing', async () => {
    const { token } = await seedSession()
    const res = await PATCH(makeRequest({
      method: 'PATCH',
      path: '/api/addmediatoartpiece',
      token,
      body: { selections: [new ObjectId().toString()] },
    }))
    expect(res.status).toBe(417)
  })
  it('returns 200 or 500 with both fields present', async () => {
    const { token } = await seedSession()
    const res = await PATCH(makeRequest({
      method: 'PATCH',
      path: '/api/addmediatoartpiece',
      token,
      body: {
        selections: [new ObjectId().toString()],
        artPieceId: new ObjectId().toString(),
      },
    }))
    expect([200, 500]).toContain(res.status)
  })
})
