import { ErrorCode, RedisData } from './interfaces'
import { get, update } from './db/session'

export async function validateToken(request: Request): Promise<{ user: any } | null> {
   const token = request.headers.get('X-Token')
   if (!token) return null

   const info = await get(token)
   if ((info as ErrorCode).code) return null
   if ((info as RedisData).data?.resetEmail) return null

   // Extend TTL on each request
   update(token)

   return { user: (info as RedisData).data }
}
