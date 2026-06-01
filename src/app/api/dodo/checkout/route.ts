import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { getDodoClient, getDodoProductId } from '@/server/dodo'
import { PLAN_ORDER, getUserPlan } from '@/server/auth/plan'
import { UserPlan } from '@/server/interfaces'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  if (process.env.NEXT_PUBLIC_DODO_ENABLED !== 'true') {
    return NextResponse.json({ error: 'dodo_disabled' }, { status: 503 })
  }

  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const plan = body?.plan as UserPlan | undefined
  if (plan !== 'intermediate' && plan !== 'full') {
    return NextResponse.json({ error: 'invalid_plan' }, { status: 400 })
  }

  const email: string | undefined = auth.user?.email
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

  const currentPlan = getUserPlan(auth.user)
  if (PLAN_ORDER[plan] <= PLAN_ORDER[currentPlan]) {
    return NextResponse.json({ error: 'no_upgrade' }, { status: 400 })
  }

  try {
    const appUrl = (process.env.APP_URL ?? '').replace(/\/$/, '')
    const session = await getDodoClient().checkoutSessions.create({
      product_cart: [{ product_id: getDodoProductId(plan), quantity: 1 }],
      customer: { email },
      return_url: appUrl ? `${appUrl}/plan?dodo=success` : undefined,
      metadata: { plan, email },
    })
    if (!session.checkout_url) {
      return NextResponse.json({ error: 'no_checkout_url' }, { status: 502 })
    }
    return NextResponse.json({ checkoutUrl: session.checkout_url })
  } catch (e) {
    console.error('[dodo/checkout] error', e)
    return NextResponse.json({ error: 'checkout_failed' }, { status: 500 })
  }
}
