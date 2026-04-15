import { NextRequest, NextResponse } from 'next/server'
import { sendPostRegistration } from '@/server/email/sendgrid'

export async function POST(request: NextRequest) {
  const body = await request.json()

  if (!body.email) {
    return NextResponse.json({}, { status: 417 })
  }

  sendPostRegistration(body.email)
  return NextResponse.json({}, { status: 200 })
}
