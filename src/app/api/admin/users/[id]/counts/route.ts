import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { validateToken } from '@/server/auth'
import { getUser, getUserCounts } from '@/server/db/database'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 401 })

  const caller = await getUser({ _id: auth.user._id })
  if (!caller || caller.deleted || caller.admin !== true) {
    return NextResponse.json({}, { status: 403 })
  }

  const { id } = await params
  if (!id || !ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'invalid_id' }, { status: 400 })
  }

  const target = await getUser({ _id: new ObjectId(id) })
  if (!target) {
    return NextResponse.json({}, { status: 404 })
  }

  const counts = await getUserCounts(target._id)
  return NextResponse.json(
    {
      id: String(target._id),
      email: target.email || '',
      name: target.profile?.name || '',
      plan: target.plan || 'free',
      counts,
    },
    { status: 200 },
  )
}
