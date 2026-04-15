import { NextRequest, NextResponse } from 'next/server'
import { addUser, addCategory, getUser, saveLoginInfo } from '@/server/db/database'
import { get, del, set } from '@/server/db/session'
import { CategoryTypes, ErrorCode, RedisData, User } from '@/server/interfaces'
import { v4 as uuidv4 } from 'uuid'
import { WithId } from 'mongodb'

export async function POST(request: NextRequest) {
  const token = request.headers.get('X-Token')

  if (!token) {
    return NextResponse.json({}, { status: 404 })
  }

  const data = await get(token)
  if ((data as ErrorCode).code) {
    return NextResponse.json({}, { status: 404 })
  }

  await del(token)

  // What happens if someone else with same email registers?
  const response = await addUser((data as RedisData).data)
  if (response === null) {
    return NextResponse.json({}, { status: 417 })
  }

  await addCategory({
    label: 'Painting',
    value: 'Painting',
    type: CategoryTypes[2]
  }, { _id: response.insertedId } as WithId<User>)

  await addCategory({
    label: 'Oil on canvas',
    value: 'Oil on canvas',
    type: CategoryTypes[0]
  }, { _id: response.insertedId } as WithId<User>)

  await addCategory({
    label: 'For sale',
    value: 'For sale',
    type: CategoryTypes[1]
  }, { _id: response.insertedId } as WithId<User>)

  const user = await getUser({ _id: response.insertedId })
  if (!user) {
    return NextResponse.json({}, { status: 404 })
  }

  await saveLoginInfo(user)
  const session = uuidv4()
  await set({ key: session, data: user, timetolive: 3600 * 24 * 1000 })
  return NextResponse.json({ session, profile: user.profile }, { status: 200 })
}
