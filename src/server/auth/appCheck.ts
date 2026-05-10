import { admin, initAdmin } from '@/server/firebase/admin'

export const verifyAppCheck = async (token: string | null | undefined): Promise<boolean> => {
  if (!token) return false
  try {
    initAdmin()
    await admin.appCheck().verifyToken(token)
    return true
  } catch {
    return false
  }
}
