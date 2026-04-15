import sharp from "sharp"
import { ARTINVENTORY_BUCKET } from "../interfaces"
import { getObject } from "../s3"

export const getImageS3 = async (path: string, w: number = 60, h: number = 60) => {
   try {
      const data = await getObject(ARTINVENTORY_BUCKET, path)
      if (data.Body) {
         const res = await resizeAndConvert(data.Body as Buffer, w, h)
         return res
      } else {
         return ""
      }
   } catch (err) {
      return ""
   }
}

export const getImageOriginal = async (path: string) => {
   try {
      const data = await getObject(ARTINVENTORY_BUCKET, path)
      if (data.Body) {
         const res = (data.Body as Buffer).toString('base64')
         return res
      } else {
         return ""
      }
   } catch (err) {
      return ""
   }
}

export const resizeAndConvert = async (buffer: Buffer, w?: number, h?: number) => {
   try {
      let res
      let width = w ? w : 120
      let height = h ? h : 120
      const sh = sharp(buffer)
      const size = await sh.metadata()
      if (size.format === 'png') {
         res = sh.resize({ width, height }).toFormat('png')
      } else {
         res = sh.resize({ width, height }).toFormat('jpeg')
      }
      return (await res.toBuffer()).toString('base64')
   } catch (e) {
      return ""
   }
}

export const resizeAndConvertJPG = async (buffer: Buffer, w?: number, h?: number) => {
   try {
      let width = w ? w : 120
      let height = h ? h : 120
      const sh = sharp(buffer)
      const res = sh.resize({ width, height }).toFormat('jpeg')
      return (await res.toBuffer()).toString('base64')
   } catch (e) {
      return ""
   }
}
