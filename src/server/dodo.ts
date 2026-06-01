import DodoPayments from 'dodopayments'
import { UserPlan } from './interfaces'

let client: DodoPayments | null = null

export function getDodoClient(): DodoPayments {
  if (client) return client

  const bearerToken = process.env.DODO_PAYMENTS_API_KEY
  const environment = process.env.DODO_PAYMENTS_ENVIRONMENT as
    | 'test_mode'
    | 'live_mode'
    | undefined
  const webhookKey = process.env.DODO_PAYMENTS_WEBHOOK_KEY

  if (!bearerToken) throw new Error('DODO_PAYMENTS_API_KEY is not configured')
  if (environment !== 'test_mode' && environment !== 'live_mode') {
    throw new Error("DODO_PAYMENTS_ENVIRONMENT must be 'test_mode' or 'live_mode'")
  }
  if (!webhookKey) throw new Error('DODO_PAYMENTS_WEBHOOK_KEY is not configured')

  client = new DodoPayments({ bearerToken, environment, webhookKey })
  return client
}

export function getDodoProductId(plan: Exclude<UserPlan, 'free'>): string {
  const id =
    plan === 'intermediate'
      ? process.env.DODO_PRODUCT_ID_INTERMEDIATE
      : process.env.DODO_PRODUCT_ID_FULL
  if (!id) {
    throw new Error(`DODO_PRODUCT_ID_${plan.toUpperCase()} not configured`)
  }
  return id
}
