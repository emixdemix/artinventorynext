import { NextResponse } from 'next/server'
import { getDodoClient } from '@/server/dodo'
import { setUserPlan } from '@/server/db/database'
import { UserPlan } from '@/server/interfaces'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request): Promise<Response> {
  if (process.env.NEXT_PUBLIC_DODO_ENABLED !== 'true') {
    return NextResponse.json({ received: true })
  }

  const rawBody = await request.text()
  const headers = {
    'webhook-id': request.headers.get('webhook-id') ?? '',
    'webhook-signature': request.headers.get('webhook-signature') ?? '',
    'webhook-timestamp': request.headers.get('webhook-timestamp') ?? '',
  }
  if (!headers['webhook-id'] || !headers['webhook-signature'] || !headers['webhook-timestamp']) {
    return NextResponse.json({ error: 'missing signature' }, { status: 400 })
  }

  let event
  try {
    event = getDodoClient().webhooks.unwrap(rawBody, { headers })
  } catch (err) {
    console.error('[dodo/webhook] signature verification failed', err)
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 })
  }

  if (event.type === 'subscription.active') {
    const metadata = (event.data as { metadata?: Record<string, unknown> }).metadata ?? {}
    const plan = metadata.plan as UserPlan | undefined
    const email = metadata.email
    if (
      typeof email === 'string' &&
      email.length > 0 &&
      (plan === 'intermediate' || plan === 'full')
    ) {
      const ok = await setUserPlan(email, plan)
      if (ok) {
        console.log(`[dodo/webhook] subscription.active set plan=${plan} for ${email}`)
      } else {
        console.error('[dodo/webhook] no user matched email', email)
      }
    } else {
      console.error('[dodo/webhook] subscription.active missing plan/email metadata', { plan, email })
    }
  }

  return NextResponse.json({ received: true })
}
