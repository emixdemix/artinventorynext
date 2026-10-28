import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { getUser, listAllUsers } from '@/server/db/database'

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 401 })

  const caller = await getUser({ _id: auth.user._id })
  if (!caller || caller.deleted || caller.admin !== true) {
    return NextResponse.json({}, { status: 403 })
  }

  const users = await listAllUsers()
  const payload = users.map(u => ({
    id: String(u._id),
    email: u.email || '',
    name: u.profile?.name || '',
    plan: u.plan || 'free',
  }))
  return NextResponse.json(payload, { status: 200 })
}
