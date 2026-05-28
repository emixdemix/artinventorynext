import { randomUUID } from 'crypto'

export const v1 = () => randomUUID()
export const v3 = () => randomUUID()
export const v4 = () => randomUUID()
export const v5 = () => randomUUID()
export const v6 = () => randomUUID()
export const v7 = () => randomUUID()
export const NIL = '00000000-0000-0000-0000-000000000000'
export const MAX = 'ffffffff-ffff-ffff-ffff-ffffffffffff'
export const validate = (s: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)
export const version = (_s: string) => 4
export const parse = (_s: string) => new Uint8Array(16)
export const stringify = (_buf: Uint8Array) => randomUUID()
