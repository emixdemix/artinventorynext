import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { listDirObjects } from '@/server/s3'
import { ARTINVENTORY_BUCKET, KeyValue } from '@/server/interfaces'

async function recursiveFolders(path: string, obj: KeyValue): Promise<KeyValue> {
  const t = await listDirObjects(ARTINVENTORY_BUCKET, path, '/')
  const folders = t.CommonPrefixes?.map(item => {
    if (item.Prefix?.endsWith('/__profile/')) {
      return ''
    }
    return new Promise((resolve) => {
      if (obj[path]) {
        const ex = (obj[path] as Array<string>).findIndex((el: string) => item.Prefix?.startsWith(el))
        if (ex === -1) {
          obj[path].push(item.Prefix)
        } else {
          obj[path][ex] = [item.Prefix]
        }
      } else {
        obj[path] = [item.Prefix]
      }
      resolve(recursiveFolders(item.Prefix as string, obj))
    })
  })
  if (folders) {
    await Promise.all(folders as Promise<KeyValue>[])
  }
  return obj
}

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const info = auth.user

  const obj = {}
  const t = await recursiveFolders(`${info._id.toString()}/`, obj)
  let replacement = JSON.stringify(t)
  replacement = replacement.replaceAll(info._id.toString(), '')
  const parsed = JSON.parse(replacement)

  return NextResponse.json(parsed, { status: 200 })
}
