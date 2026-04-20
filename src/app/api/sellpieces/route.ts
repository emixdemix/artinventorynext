import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { sellArtPieces } from '@/server/db/database'
import { ObjectId } from 'mongodb'
import { getPostHogClient } from '@/lib/posthog-server'

export async function POST(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const body = await request.json()
  const { customerId, artPieces } = body

  if (!customerId || !artPieces) {
    return NextResponse.json({}, { status: 417 })
  }

  const response = await sellArtPieces({
    customerId,
    pieces: artPieces,
    owner: new ObjectId(userId as string)
  })

  const posthog = getPostHogClient()
  posthog.capture({
    distinctId: String(userId),
    event: 'art_pieces_sold_completed',
    properties: {
      customer_id: customerId,
      num_pieces: Object.keys(artPieces).length,
    }
  })

  return NextResponse.json(response, { status: 200 })
}
