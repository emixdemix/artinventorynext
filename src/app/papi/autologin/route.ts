import { NextRequest, NextResponse } from 'next/server'
import { getUser, saveLoginInfo } from '@/server/db/database'
import { get, del, set } from '@/server/db/session'
import { ErrorCode, RedisData } from '@/server/interfaces'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  const body = await request.json()
  let token = request.headers.get('X-Token')

  if (body.email && body.code) {
    const response = await getUser({ email: body.email })
    if (!response) {
      // Alles gut but no email....
      return NextResponse.json({}, { status: 200 })
    }
    token = `${response._id.toString()}${body.code}`
  }

  if (!token) {
    return NextResponse.json({}, { status: 404 })
  }

  const data = await get(token)
  if ((data as ErrorCode).code) {
    return NextResponse.json({}, { status: 404 })
  }

  const response = await getUser({ email: (data as RedisData).data.loginEmail })
  if (!response) {
    return NextResponse.json({}, { status: 404 })
  }

  await del(token)
  await saveLoginInfo(response)
  const session = uuidv4()

  await set({ key: session, data: response, timetolive: 3600 * 1000 })
  return NextResponse.json({ session, profile: response.profile }, { status: 200 })
}
