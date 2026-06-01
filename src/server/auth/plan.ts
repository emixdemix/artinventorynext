import { UserPlan } from '@/server/interfaces'

export const PLAN_ORDER: Record<UserPlan, number> = {
  free: 0,
  intermediate: 1,
  full: 2,
}

export const getUserPlan = (user: { plan?: UserPlan } | null | undefined): UserPlan =>
  user?.plan || 'free'

export const hasPlan = (
  user: { plan?: UserPlan } | null | undefined,
  min: UserPlan,
): boolean => PLAN_ORDER[getUserPlan(user)] >= PLAN_ORDER[min]
