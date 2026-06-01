import { v4 as uuidv4 } from 'uuid'
import { WithId } from 'mongodb'

import { addCategory, addUser, getUser, saveLoginInfo } from '@/server/db/database'
import { del, get, set } from '@/server/db/session'
import { CategoryTypes, ErrorCode, RedisData, User, UserPlan } from '@/server/interfaces'
import { sendOTPCode, sendPostRegistration } from '@/server/email/sendgrid'
import bcrypt from 'bcrypt'

const OTP_TTL_MS = 10 * 60 * 1000
const SESSION_TTL_MS = 30 * 24 * 3600 * 1000

const loginOtpKey = (userId: string) => `mobile-otp:${userId}`
const signupOtpKey = (email: string) => `mobile-signup-otp:${email.toLowerCase()}`

const generateOtp = (): string => {
  const n = Math.floor(Math.random() * 1_000_000)
  return n.toString().padStart(6, '0')
}

export type OtpResult =
  | { ok: true }
  | { ok: false; status: number }

export type VerifyResult =
  | { ok: true; session: string; profile: unknown; email: string; plan: UserPlan }
  | { ok: false; status: number }

export const accountExists = async (email: string): Promise<boolean> => {
  const user = await getUser({ email })
  return !!user
}

export const requestLoginOtp = async (email: string): Promise<OtpResult> => {
  // Don't disclose whether the email exists.
  const user = await getUser({ email })
  if (!user) return { ok: true }

  try {
    const code = generateOtp()
    const key = loginOtpKey(user._id.toString())
    await del(key)
    await set({ key, data: { loginEmail: email, code }, timetolive: OTP_TTL_MS })
    await sendOTPCode(code, email)
    return { ok: true }
  } catch {
    return { ok: false, status: 500 }
  }
}

export const verifyLoginOtp = async (
  email: string,
  code: string,
): Promise<VerifyResult> => {
  if (!/^\d{6}$/.test(code)) return { ok: false, status: 400 }

  const user = await getUser({ email })
  if (!user) return { ok: false, status: 404 }

  const key = loginOtpKey(user._id.toString())
  const stored = await get(key)
  if ((stored as ErrorCode).code) return { ok: false, status: 404 }

  const data = (stored as RedisData).data as { loginEmail: string; code: string }
  if (data.code !== code || data.loginEmail !== email) {
    return { ok: false, status: 401 }
  }

  await del(key)
  await saveLoginInfo(user)

  const session = uuidv4()
  await set({ key: session, data: user, timetolive: SESSION_TTL_MS })

  return {
    ok: true,
    session,
    profile: user.profile,
    email: user.email,
    plan: user.plan || 'free',
  }
}

export const requestSignupOtp = async (email: string): Promise<OtpResult> => {
  const existing = await getUser({ email })
  if (existing) return { ok: false, status: 409 }

  try {
    const code = generateOtp()
    const key = signupOtpKey(email)
    await del(key)
    await set({ key, data: { signupEmail: email, code }, timetolive: OTP_TTL_MS })
    await sendOTPCode(code, email)
    return { ok: true }
  } catch {
    return { ok: false, status: 500 }
  }
}

export const verifySignupOtp = async (
  email: string,
  code: string,
): Promise<VerifyResult> => {
  if (!/^\d{6}$/.test(code)) return { ok: false, status: 400 }

  const key = signupOtpKey(email)
  const stored = await get(key)
  if ((stored as ErrorCode).code) return { ok: false, status: 404 }

  const data = (stored as RedisData).data as { signupEmail: string; code: string }
  if (data.code !== code || data.signupEmail !== email) {
    return { ok: false, status: 401 }
  }

  await del(key)

  const existing = await getUser({ email })
  if (existing) return { ok: false, status: 409 }

  const password = bcrypt.hashSync(uuidv4(), 10)
  const inserted = await addUser({ email, password })
  if (!inserted) return { ok: false, status: 500 }

  await Promise.all([
    addCategory(
      { label: 'Painting', value: 'Painting', type: CategoryTypes[2] },
      { _id: inserted.insertedId } as WithId<User>,
    ),
    addCategory(
      { label: 'Oil on canvas', value: 'Oil on canvas', type: CategoryTypes[0] },
      { _id: inserted.insertedId } as WithId<User>,
    ),
    addCategory(
      { label: 'For sale', value: 'For sale', type: CategoryTypes[1] },
      { _id: inserted.insertedId } as WithId<User>,
    ),
  ])

  const user = await getUser({ _id: inserted.insertedId })
  if (!user) return { ok: false, status: 500 }

  await saveLoginInfo(user)

  try {
    await sendPostRegistration(email)
  } catch {
    // Non-fatal: user is created and signed in regardless.
  }

  const session = uuidv4()
  await set({ key: session, data: user, timetolive: SESSION_TTL_MS })

  return {
    ok: true,
    session,
    profile: user.profile,
    email: user.email,
    plan: user.plan || 'free',
  }
}
