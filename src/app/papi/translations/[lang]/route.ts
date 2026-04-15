import { NextRequest, NextResponse } from 'next/server'
import { getTranslations } from '@/server/db/database'
import { LANGUAGES_SUPPORTED } from '@/server/interfaces'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params
  const tr = await getTranslations((lang || 'en-us') as LANGUAGES_SUPPORTED)
  return NextResponse.json(tr, { status: 200 })
}
