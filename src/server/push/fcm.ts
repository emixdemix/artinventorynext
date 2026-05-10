import { ObjectId } from 'mongodb'
import { admin, initAdmin } from '../firebase/admin'

import { getUser, removeUserPushToken } from '../db/database'

export type PushPayload = {
  title: string
  body: string
  data?: Record<string, string>
}

export type SendResult = {
  sent: number
  removed: number
  failed: number
}

const isInvalidTokenError = (code?: string): boolean =>
  code === 'messaging/registration-token-not-registered' ||
  code === 'messaging/invalid-registration-token' ||
  code === 'messaging/invalid-argument'

const buildMessage = (
  token: string,
  payload: PushPayload,
  notificationCount: number,
): admin.messaging.Message => ({
  token,
  notification: { title: payload.title, body: payload.body },
  data: payload.data,
  apns: {
    payload: {
      aps: {
        badge: notificationCount,
        sound: 'default',
      },
    },
  },
  android: {
    priority: 'high',
    notification: {
      notificationCount,
      sound: 'default',
    },
  },
})

/**
 * Send a push notification to every device registered for `userId`.
 * `notificationCount` is mirrored to the iOS app icon badge and the
 * Android notification count. Tokens that come back as unregistered or
 * invalid are removed from the user profile.
 */
export const sendPushToUser = async (
  userId: ObjectId,
  payload: PushPayload,
  notificationCount: number,
): Promise<SendResult> => {
  initAdmin()

  const user = await getUser({ _id: userId })
  const tokens = user?.profile?.pushTokens ?? []
  if (tokens.length === 0) {
    return { sent: 0, removed: 0, failed: 0 }
  }

  const messages = tokens.map((t) =>
    buildMessage(t.token, payload, notificationCount),
  )

  const response = await admin.messaging().sendEach(messages)

  let sent = 0
  let removed = 0
  let failed = 0
  const removals: Promise<unknown>[] = []

  response.responses.forEach((res, idx) => {
    if (res.success) {
      sent += 1
      return
    }
    failed += 1
    const code = res.error?.code
    if (isInvalidTokenError(code)) {
      removed += 1
      removals.push(removeUserPushToken(userId, tokens[idx].token))
    }
  })

  if (removals.length > 0) {
    await Promise.all(removals)
  }

  return { sent, removed, failed }
}
