import { DeleteResult, InsertOneResult, UpdateResult } from "mongodb"
import { ErrorCode, RedisData } from "../interfaces"
import { ARTINVENTORY_DB, getDbClient, REDIS_COLLECTION } from "./connection"

export const set = async (data: RedisData): Promise<InsertOneResult<RedisData> | ErrorCode> => {
   try {
      const client = await getDbClient()
      const db = client.db(ARTINVENTORY_DB)
      const collection = db.collection(REDIS_COLLECTION)
      const c = await collection.insertOne({
         key: data.key,
         data: data.data,
         timetolive: Date.now() + data.timetolive
      })
      if (c) {
         return c
      } else {
         return { code: 0x0001, description: "Cannot find user" }
      }
   } catch (e) {
      console.error("DB Error on seeking")
      return { code: 0x0002, description: "Cannot read database" }
   }
}

export const get = async (key: string): Promise<RedisData | ErrorCode> => {
   try {
      const client = await getDbClient()
      const db = client.db(ARTINVENTORY_DB)
      const collection = db.collection(REDIS_COLLECTION)
      const c = await collection.findOne<RedisData>({ key })
      if (c) {
         return c
      } else {
         return { code: 0x0001, description: "Cannot find user" }
      }
   } catch (e) {
      console.error("DB Error on seeking")
      return { code: 0x0002, description: "Cannot read database" }
   }
}

export const del = async (key: string): Promise<DeleteResult | ErrorCode> => {
   try {
      const client = await getDbClient()
      const db = client.db(ARTINVENTORY_DB)
      const collection = db.collection(REDIS_COLLECTION)
      const c = await collection.deleteOne({ key })
      if (c) {
         return c
      } else {
         return { code: 0x0001, description: "Cannot find user" }
      }
   } catch (e) {
      console.error("DB Error on seeking")
      return { code: 0x0002, description: "Cannot read database" }
   }
}

export const updateSessionToken = async (key: string, code: string): Promise<UpdateResult | ErrorCode> => {
   try {
      const client = await getDbClient()
      const db = client.db(ARTINVENTORY_DB)
      const collection = db.collection(REDIS_COLLECTION)
      const c = await collection.updateOne({ key }, { $set: { "data.verifiedEmail": true, "data.code": code } })
      return c
   } catch (e) {
      console.error("DB Error on seeking")
      return { code: 0x0002, description: "Cannot read database" }
   }
}

export const update = async (key: string): Promise<UpdateResult | ErrorCode> => {
   try {
      const client = await getDbClient()
      const db = client.db(ARTINVENTORY_DB)
      const collection = db.collection(REDIS_COLLECTION)
      const c = await collection.updateOne({ key }, { $set: { timetolive: Date.now() + 3600 * 24 * 1000 } })
      return c
   } catch (e) {
      console.error("DB Error on seeking")
      return { code: 0x0002, description: "Cannot read database" }
   }
}

export const removeExpired = async (): Promise<DeleteResult | ErrorCode> => {
   try {
      const client = await getDbClient()
      const db = client.db(ARTINVENTORY_DB)
      const collection = db.collection(REDIS_COLLECTION)
      const c = await collection.deleteMany({ timetolive: { $lt: Date.now() } })
      if (c) {
         return c
      } else {
         return { code: 0x0001, description: "Cannot find user" }
      }
   } catch (e) {
      console.error("DB Error on seeking")
      return { code: 0x0002, description: "Cannot read database" }
   }
}
