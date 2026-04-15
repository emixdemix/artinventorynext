import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { getUser, getDataAsCSV } from '@/server/db/database'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const type = request.nextUrl.searchParams.get('type')
  if (!type) {
    return NextResponse.json({}, { status: 417 })
  }

  const owner = new ObjectId(userId as string)
  const user = await getUser({ _id: owner })
  if (!user) {
    return NextResponse.json({}, { status: 404 })
  }

  switch (type) {
    case 'data': {
      const data = await getDataAsCSV(user)
      return new NextResponse(Buffer.from(data), {
        status: 200,
        headers: { 'Content-Type': 'text/csv' }
      })
    }
    case 'images': {
      // TODO: Implement ZIP download for Next.js (s3-zip stream adaptation needed)
      return NextResponse.json({ error: 'Image ZIP download not yet supported' }, { status: 501 })
    }
    default:
      return NextResponse.json({}, { status: 417 })
  }
}
