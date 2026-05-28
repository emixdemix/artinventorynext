import { POST } from '@/app/api/catalog/route'
import { makeRequest, seedSession, closeAll } from '../setup/helpers'
import { ObjectId } from 'mongodb'

afterAll(async () => { await closeAll() })

describe('POST /api/catalog', () => {
  it('401 without token', async () => {
    const res = await POST(makeRequest({ method: 'POST', path: '/api/catalog', body: {} }))
    expect(res.status).toBe(401)
  })
  it('417 when catalog type is missing', async () => {
    const { token } = await seedSession()
    const res = await POST(makeRequest({
      method: 'POST', path: '/api/catalog', token,
      body: { selectedList: [new ObjectId().toString()] },
    }))
    expect(res.status).toBe(417)
  })
  it('417 when both selectedList and list are missing', async () => {
    const { token } = await seedSession()
    const res = await POST(makeRequest({
      method: 'POST', path: '/api/catalog', token,
      body: { catalog: 'singlepage' },
    }))
    expect(res.status).toBe(417)
  })
  it('404 with invalid catalog type', async () => {
    const { token } = await seedSession()
    const res = await POST(makeRequest({
      method: 'POST', path: '/api/catalog', token,
      body: { catalog: 'unknown-layout', selectedList: [new ObjectId().toString()] },
    }))
    expect([404, 500]).toContain(res.status)
  })
})
