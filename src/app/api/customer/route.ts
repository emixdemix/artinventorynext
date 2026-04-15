import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { getCustomer, addCustomer, updateCustomer, deleteCustomer } from '@/server/db/database'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({}, { status: 417 })
  }

  const owner = new ObjectId(userId as string)
  const response = await getCustomer({ owner, _id: new ObjectId(id) })
  if (response) {
    return NextResponse.json(response, { status: 200 })
  } else {
    return NextResponse.json({}, { status: 404 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const info = auth.user

  const body = await request.json()
  const { name, _id } = body

  if (!name) {
    return NextResponse.json({}, { status: 417 })
  }

  try {
    if (_id) {
      await updateCustomer(body, info)
    } else {
      await addCustomer(body, info)
    }
    return NextResponse.json({}, { status: 200 })
  } catch (e) {
    return NextResponse.json({}, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const customerId = request.nextUrl.searchParams.get('id')
  if (!customerId) {
    return NextResponse.json({}, { status: 417 })
  }

  const owner = new ObjectId(userId as string)
  const record = await deleteCustomer(customerId, owner)
  if ((record && record.deletedCount <= 0) || !record) {
    return NextResponse.json({}, { status: 404 })
  }

  return NextResponse.json({}, { status: 200 })
}
