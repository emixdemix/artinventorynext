import { DeleteResult, InsertOneResult, MongoClient, ObjectId, OptionalId, UpdateResult, WithId } from "mongodb"
import { ARTINVENTORY_DB, getDbClient, ARTPIECES_COLLECTION, PICTURES_COLLECTION, CATEGORIES_COLLECTION, CUSTOMER_COLLECTION, SELECTIONS_COLLECTION, FEEDBACKS_COLLECTION, REPORTS_COLLECTION, SHOWS_COLLECTION, TRANSLATIONS_COLLECTION, LOGINS_COLLECTION, USERS_COLLECTION, TEMPLATES_COLLECTION } from "./connection"
import { ArtPiece, Category, KeyValue, Picture, User, Selection, ErrorCode, Feedback, Reports, Shows, UserProfile, ARTINVENTORY_BUCKET, Translations, LANGUAGES_SUPPORTED, Logins, Customer, Template } from "../interfaces"
import sharp from "sharp"
import { getImageS3, resizeAndConvert, resizeAndConvertJPG } from "../utility/image"
import { copyObject, deleteObject, listDirObjects } from "../s3"

export const getArtPieces = async (query: KeyValue): Promise<WithId<ArtPiece>[]> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<ArtPiece[]>(ARTPIECES_COLLECTION)

   const pipeline = [
      { $match: query },
      {
         $lookup: {
            from: "pictures",
            localField: "pictureId",
            foreignField: "_id",
            as: "pictures",
            pipeline: [
               {
                  $project:
                     { "url": 1 }
               },
            ]
         },
      },
      {
         $lookup: {
            from: "pictures",
            localField: "extraMedia",
            foreignField: "_id",
            as: "otherMedia"
         },
      },
      {
         $lookup: {
            from: "categories",
            localField: "categories",
            foreignField: "_id",
            as: "cats"
         }
      },
      {
         $sort: {
            order: 1
         }
      }
   ]
   const pieces = collection.aggregate<WithId<ArtPiece>>(pipeline)

   return await pieces.toArray()
}

export const getSalesArtPieces = async (query: KeyValue): Promise<KeyValue[]> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection(CUSTOMER_COLLECTION)

   const pipeline = [
      // {  //FOR one artpiece in particular...
      //   $match: { "artpieces._id": new ObjectId(query.id as string), owner: query.owner }
      // },
      {$unwind:"$artpieces"},
      {
        $group:
          {
            _id: "$artpieces._id",
            qt: {
              $sum: "$artpieces.quantity"
            }
          }
      },
      {
         $sort: {"artpieces.quantity": 1}
      }
    ]
   const pieces = collection.aggregate(pipeline)

   return await pieces.toArray()
}

export const sellArtPieces = async (query: KeyValue): Promise<UpdateResult<Customer>> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Customer>(CUSTOMER_COLLECTION)

   const pieces = Object.keys(query.pieces).map(item => {
      return {quantity: query.pieces[item], _id: new ObjectId(item), createdAt: Date.now().valueOf()}
   })

   const result = await collection.updateOne(
      { _id: new ObjectId(query.customerId as string), owner: query.owner },
      {
         $push: { artpieces: { $each: pieces } }
      }
   )

   return result
}


export const addMediaToArtpiece = async (query: KeyValue): Promise<UpdateResult<ArtPiece>> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<ArtPiece>(ARTPIECES_COLLECTION)

   const pieces = collection.updateOne(
      { _id: query.id, owner: query.owner },
      {
         $set: { extraMedia: query.selections }
      }
   )
   return await pieces
}

export const updateSelection = async (query: KeyValue): Promise<ErrorCode> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Selection>(SELECTIONS_COLLECTION)

   if (query.selectionId) {
      let final
      const selection = await collection.findOne({ owner: query.owner, _id: new ObjectId(query.selectionId as string) })
      if (selection) {
         if (query.replace) {
            final = query.selections as ObjectId[]
         } else {
            const ap = selection.artpieces.map(item => item.toString())
            const qs = query.selections.map((item: ObjectId) => item.toString())
            final = [...new Set([...ap, ...qs])]
         }

         const result = await collection.updateOne({ _id: selection._id }, {
            $set: { "artpieces": final.map(item => new ObjectId(item as string)) }
         })
         return { code: 0x0000, description: "ok" }
      } else {
         return { code: 0x0001, description: "Selection not found" }
      }
   }

   if (query.name) {
      const selection = await collection.findOne({ owner: query.owner, name: query.name })
      if (selection) {
         return { code: 0x0002, description: "Selection already exists" }
      } else {
         const result = await collection.insertOne({
            artpieces: query.selections,
            owner: query.owner,
            name: query.name
         })
         return { code: 0x0000, description: "ok" }
      }
   }

   return { code: 0x0003, description: "Cannot execute command" }
}

export const removeFromSelection = async (query: KeyValue): Promise<ErrorCode> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Selection>(SELECTIONS_COLLECTION)

   if (query.selectionId) {
      const selection = await collection.findOne({ owner: query.owner, _id: new ObjectId(query.selectionId as string) })
      if (selection) {
         const ap = selection.artpieces.map(item => item.toString())
         const qs = ap.filter(item => !query.ids.includes(item))
         const result = await collection.updateOne({ _id: selection._id }, {
            $set: { "artpieces": qs.map(item => new ObjectId(item as string)) }
         })
         return { code: 0x0000, description: "ok" }
      } else {
         return { code: 0x0001, description: "Selection not found" }
      }
   }

   return { code: 0x0003, description: "Cannot execute command" }
}

export const getArtSelections = async (query: KeyValue): Promise<Document[]> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Document[]>(SELECTIONS_COLLECTION)

   const pipeline = [
      { $match: query },
      {
         $lookup: {
            from: "artpieces",
            localField: "artpieces",
            foreignField: "_id",
            as: "artpieces"
         }
      },
      {
         $sort: {
            name: 1
         }
      }
   ]
   const pieces = collection.aggregate<Document>(pipeline)

   return await pieces.toArray()
}

export interface PDFDao {
   pieces: ArtPieceWithImage[]
}

export interface ArtPieceWithImage extends ArtPiece {
   images: Picture[]
}

export const getArtSelectionsWithImages = async (query: KeyValue): Promise<ArtPieceWithImage[]> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<ArtPieceWithImage[]>(SELECTIONS_COLLECTION)

   const pipeline = [
      { $match: query },
      {
         $lookup:
         {
            from: "artpieces",
            localField: "artpieces",
            foreignField: "_id",
            let: { pid: "$pictureId" },
            pipeline: [
               { $unwind: "$pictureId" },
               {
                  $lookup: {
                     from: "pictures",
                     localField: "pictureId",
                     foreignField: "_id",
                     as: "images"
                  }
               },
               {
                  $lookup: {
                     from: "pictures",
                     localField: "extraMedia",
                     foreignField: "_id",
                     as: "extramedia"
                  }
               }
            ],
            as: "pieces"
         }
      }
   ]
   const pieces = collection.aggregate<PDFDao>(pipeline)

   return (await pieces.toArray())[0].pieces
}

export const getArtWithImages = async (query: KeyValue): Promise<ArtPieceWithImage[]> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<ArtPieceWithImage[]>(ARTPIECES_COLLECTION)

   const pipeline = [
      { $match: query },
      {
         $lookup: {
            from: "pictures",
            localField: "pictureId",
            foreignField: "_id",
            as: "images"
         }
      }
   ]


   const pieces = collection.aggregate<ArtPieceWithImage>(pipeline)
   const d = await pieces.toArray()
   return d
}

export const getShows = async (owner: ObjectId): Promise<Shows[]> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Shows[]>(SHOWS_COLLECTION)
   const pipeline = [
      { $match: { owner } },
      {
         $sort: {
            begin: -1
         }
      }
   ]

   const pieces = collection.aggregate<WithId<Shows>>(pipeline)

   return await pieces.toArray()
}

export const getFeedback = async (id: string, owner: ObjectId): Promise<Feedback[]> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Feedback[]>(FEEDBACKS_COLLECTION)

   let match
   if (id) {
      match = { $match: { owner, _id: new ObjectId(id) } }
   } else {
      match = { $match: { owner } }
   }
   const pipeline = [
      match,
      {
         $sort: {
            createdAt: -1
         }
      }
   ]

   const pieces = collection.aggregate<WithId<Feedback>>(pipeline)

   return await pieces.toArray()
}

export const getShow = async (query: KeyValue): Promise<WithId<Shows> | null> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Shows>(SHOWS_COLLECTION)

   const pieces = await collection.findOne<WithId<Shows>>(query)

   return pieces
}

export const getCustomer = async (query: KeyValue): Promise<WithId<Customer> | null> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Customer>(CUSTOMER_COLLECTION)

   const pieces = await collection.findOne<WithId<Customer>>(query)

   return pieces
}

export const getCustomers = async (query: KeyValue): Promise<WithId<Customer>[] | null> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Customer>(CUSTOMER_COLLECTION)

   const pipeline = [
      {$match: query },
      {$sort: { "name": 1}}
   ]
   const pieces = collection.aggregate<WithId<Customer>>(pipeline)
   const data = await pieces.toArray()
   return data
}

export const deleteShow = async (showId: string, owner: ObjectId): Promise<DeleteResult> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Shows>(SHOWS_COLLECTION)

   const pieces = await collection.deleteOne({ owner, _id: new ObjectId(showId) })

   return pieces
}

export const getReports = async (): Promise<Reports[]> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Reports[]>(REPORTS_COLLECTION)

   const pieces = collection.find<Reports>({})

   return await pieces.toArray()
}

export const getCategories = async (query: KeyValue): Promise<Category[]> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Category[]>(CATEGORIES_COLLECTION)

   const pipeline = [
      { $match: query },
      {
         $sort: {
            label: 1
         }
      }
   ]
   const pieces = collection.aggregate<Category>(pipeline)

   return await pieces.toArray()
}

export const getPictures = async (query: KeyValue): Promise<WithId<Picture>[]> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Picture[]>(PICTURES_COLLECTION)

   const pipeline = [
      { $match: query },
      {
         $lookup:
         {
            from: 'artpieces',
            localField: '_id',
            foreignField: 'pictureId',
            as: 'details'
         }
      }
   ]
   const pieces = collection.aggregate<WithId<Picture>>(pipeline)

   return await pieces.toArray()
}

export const deleteArtPiece = async (artPieceId: string, user: WithId<User>): Promise<DeleteResult> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<ArtPiece>(ARTPIECES_COLLECTION)

   const pieces = await collection.deleteOne({ owner: user._id, _id: new ObjectId(artPieceId) })

   return pieces
}

export const deleteSelection = async (selectionId: string, owner: ObjectId): Promise<DeleteResult> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Selection>(SELECTIONS_COLLECTION)

   const pieces = await collection.deleteOne({ owner, _id: new ObjectId(selectionId) })

   return pieces
}

export const deleteMedia = async (mediaId: string, owner: ObjectId): Promise<DeleteResult | null> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Picture>(PICTURES_COLLECTION)

   const media = await collection.findOne({ _id: new ObjectId(mediaId), owner })
   if (media) {
      const pieces = await collection.deleteOne({ _id: new ObjectId(mediaId) })
      const key = `${owner.toString()}/${media.url}`
      console.log('KEY:', key)
      const d = await deleteObject(ARTINVENTORY_BUCKET, key)
      return pieces
   }

   return null
}

export const deleteCategory = async (id: string, owner: ObjectId): Promise<DeleteResult> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Category>(CATEGORIES_COLLECTION)

   const pieces = await collection.deleteOne({ _id: new ObjectId(id) })

   return pieces
}

export const deleteCustomer = async (id: string, owner: ObjectId): Promise<DeleteResult> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Customer>(CUSTOMER_COLLECTION)

   const pieces = await collection.deleteOne({ _id: new ObjectId(id), owner })

   return pieces
}

export const addCategory = async (data: KeyValue, user: WithId<User>): Promise<InsertOneResult> => {
   let pictureId
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Category>(CATEGORIES_COLLECTION)

   const res = collection.insertOne({
      label: data.label,
      value: data.value,
      owner: user._id,
      type: data.type
   })

   return res

}

export const addShow = async (data: KeyValue, user: WithId<User>): Promise<InsertOneResult> => {
   let pictureId
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Shows>(SHOWS_COLLECTION)

   const res = collection.insertOne({
      owner: user._id,
      name: data.name,
      location: data.location,
      list: new ObjectId(data.list as string),
      begin: data.begin,
      end: data.end,
      website: data.website,
      description: data.description
   })

   return res

}

export const addCustomer = async (data: KeyValue, user: WithId<User>): Promise<InsertOneResult> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Customer>(CUSTOMER_COLLECTION)

   const res = collection.insertOne({
      owner: user._id,
      name: data.name,
      location: {
         city: data.city,
         country: data.country,
         state: data.state,
         street: data.address
      },
      contactEmail: data.email,
      description: data.description,
      contactName: data.name,
      contactNumber: data.number,
      artpieces: []
   })

   return res

}

export const updateCustomer = async (data: KeyValue, user: WithId<User>): Promise<UpdateResult> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Customer>(CUSTOMER_COLLECTION)

   const res = await collection.updateOne({
      owner: user._id,
      _id: new ObjectId(data._id as string)
   },{
      $set: {
      name: data.name,
      location: {
         city: data.city,
         country: data.country,
         state: data.state,
         street: data.address
      },
      contactEmail: data.email,
      description: data.description,
      contactName: data.name,
      contactNumber: data.number,
   }
   })

   return res

}

export const updateShow = async (data: KeyValue, user: WithId<User>): Promise<UpdateResult> => {
   let pictureId
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Shows>(SHOWS_COLLECTION)

   const res = collection.updateOne({ _id: new ObjectId(data._id as string), owner: user._id },
      {
         $set: {
            owner: user._id,
            name: data.name,
            location: data.location,
            list: new ObjectId(data.list as string),
            begin: data.begin,
            end: data.end,
            website: data.website,
            description: data.description
         }
      })

   return res

}

export const addFeedback = async (data: KeyValue, user: WithId<User>): Promise<InsertOneResult> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Feedback>(FEEDBACKS_COLLECTION)

   const res = collection.insertOne({
      owner: user._id,
      description: data.description,
      option: data.option,
      createdAt: Date.now().valueOf()
   })

   return res

}

export const addArtPiece = async (data: KeyValue, filename: string, size: sharp.Metadata, user: WithId<User>, image: Buffer<ArrayBufferLike>): Promise<InsertOneResult> => {
   let pictureId
   let b64 = ''
   const list: string[] = JSON.parse(data.categories || "[]") as string[]
   const cats = list.map(item => new ObjectId(item))
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Picture>(PICTURES_COLLECTION)
   if (filename) {
      b64 = await resizeAndConvert(image, 60, 60)
      const media = await resizeAndConvert(image, 120, 90)
      const pieces = await collection.insertOne({
         dimensions: `${size.width} x ${size.height}`,
         url: filename,
         originalName: data.originalname,
         extension: size.format?.toString() || "png",
         b64Image: b64,
         mediaImage: media,
         owner: user._id,
         name: data.title,
         media: data.media
      })
      pictureId = new ObjectId(pieces.insertedId)
   } else {
      pictureId = new ObjectId(data.imageId as string)
      const images = await getPictures({ owner: new ObjectId(user._id), _id: pictureId })
      if (Array.isArray(images) && images.length > 0) {
         b64 = images[0].b64Image
      }
   }

   const artcollection = db?.collection<ArtPiece>(ARTPIECES_COLLECTION)

   const art = await artcollection.insertOne({
      pictureId: [pictureId],
      categories: cats,
      dimensions: data.dimensions || '',
      title: data.title,
      media: data.media,
      description: data.description,
      creation_date: data.year || new Date().getFullYear,
      price: data.price || 0,
      order: 0,
      b64Image: b64,
      quantity: data.quantity || 1,
      owner: user._id,
      extraMedia: []
   })

   return art
}

export const addTemplate = async (data: KeyValue): Promise<InsertOneResult> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Template>(TEMPLATES_COLLECTION)
   const pieces = await collection.insertOne(data as OptionalId<Template>)

   return pieces
}


export const addMedia = async (data: KeyValue, filename: string, user: WithId<User>, image: Buffer<ArrayBufferLike>): Promise<InsertOneResult> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Picture>(PICTURES_COLLECTION)
   const size = await sharp(image).metadata()

   const b64 = await resizeAndConvert(image, 60, 60)
   const media = await resizeAndConvert(image, 120, 90)
   const pieces = await collection.insertOne({
      dimensions: `${size.width} x ${size.height}`,
      url: filename,
      name: data.name,
      originalName: data.originalname,
      extension: size.format?.toString() || "png",
      b64Image: b64,
      mediaImage: media,
      owner: user._id,
      media: data.media
   })

   return pieces
}

export const updateArtPiece = async (data: KeyValue, filename: string, size: sharp.Metadata, user: WithId<User>, image: Buffer<ArrayBufferLike>): Promise<any> => {
   let b64
   const list: string[] = JSON.parse(data.categories) as string[]
   const cats = list.map(item => new ObjectId(item))
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   if (filename) {
      const collection = db?.collection<Picture>(PICTURES_COLLECTION)
      b64 = await resizeAndConvert(image, 60, 60)
      const media = await resizeAndConvert(image, 120, 90)
      const pieces = await collection.insertOne({
         dimensions: `${size.width} x ${size.height}`,
         url: filename,
         originalName: data.originalname,
         extension: size.format?.toString() || "png",
         b64Image: b64,
         mediaImage: media,
         owner: user._id,
         name: data.title,
         media: data.media
      })

      const pictureId = new ObjectId(pieces.insertedId)

      const artcollection = db?.collection<ArtPiece>(ARTPIECES_COLLECTION)

      const art = await artcollection.updateOne({ _id: new ObjectId(data.artPieceId as string) }, {
         $set: {
            pictureId: [pictureId],
            dimensions: data.dimensions,
            title: data.title,
            description: data.description,
            creation_date: data.year,
            price: data.price,
            quantity: data.quantity,
            b64Image: b64,
            categories: cats,
            media: data.media
         }
      })
      return art
   } else {
      const artcollection = db?.collection<ArtPiece>(ARTPIECES_COLLECTION)
      const pictureId = new ObjectId(data.imageId as string)

      const images = await getPictures({ owner: new ObjectId(user._id), _id: pictureId })
      if (Array.isArray(images) && images.length > 0) {
         b64 = images[0].b64Image
      }

      const art = await artcollection.updateOne(
         { _id: new ObjectId(data.artPieceId as string) }, [{
            $set: {
               dimensions: data.dimensions,
               title: data.title,
               description: data.description,
               creation_date: data.year,
               price: data.price,
               pictureId: [pictureId],
               b64Image: b64,
               categories: cats,
               quantity: data.quantity,
               media: data.media
            }
         }]
      )
      return art
   }
}

export const getTranslations = async (lang: LANGUAGES_SUPPORTED): Promise<KeyValue> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Translations>(TRANSLATIONS_COLLECTION)
   const pieces = collection.find()
   const translation = await pieces.toArray()
   const data = translation[0][lang]
   if (!data) {
      return translation[0]['en-us']
   }
   return data
}

export const getTemplate = async (name: string): Promise<WithId<Template> | null> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Template>(TEMPLATES_COLLECTION)
   const pieces = await collection.findOne({name})
   return pieces
}



export const getUser = async (query: KeyValue): Promise<WithId<User>> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<User>(USERS_COLLECTION)
   const pieces = collection.find(query)
   const user = await pieces.toArray()
   return user[0]
}

export const saveLoginInfo = async (user:WithId<User>): Promise<InsertOneResult<Logins> | null> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Logins>(LOGINS_COLLECTION)
   try {
      const login = await collection.insertOne({
        userId: user._id,
        createdAt: Date.now().valueOf()
      })

      return login
   } catch (e) {
      return null
   }
}


export const updatePicture = async (query: KeyValue, data: KeyValue): Promise<UpdateResult<Picture>> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<Picture>(PICTURES_COLLECTION)

   const pieces = await collection.updateOne(query, data)

   return pieces
}

export const updatePassword = async (query: KeyValue): Promise<UpdateResult<User> | null> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<User>(USERS_COLLECTION)
   try {
      const user = await collection.updateOne({ "_id": query.id }, {
         $set: { "password": query.password }
      })

      return user
   } catch (e) {
      return null
   }
}

export const updateProfile = async (query: KeyValue, user: WithId<User>, fileData: Buffer | null, filename: string): Promise<UserProfile> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<User>(USERS_COLLECTION)

   const u = await collection.findOne({ _id: user._id })
   if (!u) {
      return {} as UserProfile
   }

   if (fileData && u.profile.url && query.filetype === 'avatar') {
      await deleteObject(ARTINVENTORY_BUCKET, u.profile.url)
   }

   if (fileData && u.profile.front && query.filetype === 'front') {
      await deleteObject(ARTINVENTORY_BUCKET, u.profile.front)
   }

   if (fileData && u.profile.back && query.filetype === 'back') {
      await deleteObject(ARTINVENTORY_BUCKET, u.profile.back)
   }

   if (query.name !== undefined) {
      u.profile.name = query.name
   }

   if (query.website !== undefined) {
      u.profile.website = query.website
   }

   if (query.statement !== undefined) {
      u.profile.statement = query.statement
   }

   if (query.signature !== undefined) {
      u.profile.signature = query.signature
   }

   if (query.describe !== undefined) {
      u.profile.describe = query.describe
   }

   if (query.measures !== undefined) {
      u.profile.measures = query.measures
   }

   if (query.valuta !== undefined) {
      u.profile.valuta = query.valuta
   }

   if (fileData && u.profile.url && query.filetype === 'avatar')  {
      const b64 = await resizeAndConvert(fileData, 180, 180)
      u.profile.picture = b64
      u.profile.url = filename
   }

   if (fileData && (query.filetype === 'front')) {
      const b64 = await resizeAndConvertJPG(fileData, 595, 842)
      u.profile.front = b64
      u.profile.fronturl = filename
   }

   if (fileData && (query.filetype === 'back')) {
      const b64 = await resizeAndConvertJPG(fileData, 595, 842)
      u.profile.back = b64
      u.profile.backurl = filename
   }

   const response = await collection.updateOne({ _id: user._id }, {
      $set: {
         profile: u.profile
      }
   })

   return u.profile as UserProfile
}

export const addUser = async (query: KeyValue): Promise<InsertOneResult<User> | null> => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<User>(USERS_COLLECTION)
   try {
      const user = await collection.insertOne({
         email: query.email,
         password: query.password,
         name: "",
         profile: {
            name: query.email,
            picture: "",
            describe: "",
            url: "",
            website: "",
            statement: "",
            front: "",
            signature: `Copyright ${query.email}`,
            back: "",
            fronturl: "",
            backurl: "",
            measures: "cm",
            valuta: "euro"
         }
      })

      return user
   } catch (e) {
      return null
   }
}

export const orderArtPieces = async (params: { owner: ObjectId, ids: string[] }) => {
   let order = 0
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<ArtPiece>(ARTPIECES_COLLECTION)
   const promises = [] as any[]

   params.ids.forEach(id => {
      promises.push(new Promise((resolve) => {
         collection.updateOne({ _id: new ObjectId(id), owner: params.owner }, { $set: { order } }).then(response => {
            resolve({})
         })
      }))
      order++
   })

   await Promise.all(promises)
}

const getStatisticsPipeline = (owner:ObjectId, type:string) => {
   return [
      {$match: {"owner": owner}},
      {
        $lookup:
          {
            from: "categories",
            localField: "categories",
            foreignField: "_id",
            as: "result",
            pipeline: [
              {$match: {"type": type}}
            ]
          }
      },
      { $unwind: "$result" },
      {
        $group: {
          _id: ["$result.value", "$result.type"],
          count: {
            $sum: 1
          }
        }
      }
    ]
}

export const getStatistics = async (owner:ObjectId) => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<ArtPiece>(ARTPIECES_COLLECTION)
   let pieces = collection.aggregate<WithId<ArtPiece>>(getStatisticsPipeline(owner, 'status'))
   const statuses = await pieces.toArray()
   pieces = collection.aggregate<WithId<ArtPiece>>(getStatisticsPipeline(owner, 'category'))
   const categories = await pieces.toArray()
   pieces = collection.aggregate<WithId<ArtPiece>>(getStatisticsPipeline(owner, 'arttype'))
   const arttpyes = await pieces.toArray()

   return {statuses, arttpyes, categories}
}

export const removeCategoryFromArtPieces = async (category: string) => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<ArtPiece>(ARTPIECES_COLLECTION)
   const res = collection.updateMany({
      owner: new ObjectId('67961868591e44c5cb1a424e'),
      categories: {
         $in: [
            new ObjectId(category)
         ]
      }
   }, { $pull: { categories: new ObjectId(category) } })
   return res
}

export const updateAllRecords = async () => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const artcollection = db?.collection<ArtPiece>(ARTPIECES_COLLECTION)
   const owner = new ObjectId('67961868591e44c5cb1a424e')

   const records = await getArtPieces({ owner })
   const promises = [] as any
   records.forEach(element => promises.push(new Promise(async (resolve) => {
      let b64
      const pictureId = new ObjectId(element.pictureId[0])
      const images = await getPictures({ owner, _id: pictureId })
      if (Array.isArray(images) && images.length > 0) {
         const path = `67961868591e44c5cb1a424e/${images[0].url}`
         const response = await getImageS3(path, 60, 60)
         b64 = response
         const art = await artcollection.updateOne({ _id: new ObjectId(element._id) }, {
            $set: {
               b64Image: b64
            }
         })
      }
      resolve({})
   })))

   Promise.all(promises).then((a) => {
      console.log(a)
   })
}

export const updateAllPictureRecords = async () => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const collection = db?.collection<WithId<Picture>>(PICTURES_COLLECTION)
   const owner = new ObjectId('67961868591e44c5cb1a424e')

   const records = await getPictures({ owner })
   const promises = [] as any
   records.forEach(element => promises.push(new Promise(async (resolve) => {
      let b64
      const pictureId = new ObjectId(element._id)

      const path = `67961868591e44c5cb1a424e/${element.url}`
      const response = await getImageS3(path, 120, 90)
      b64 = response
      const art = await collection.updateOne({ _id: pictureId }, {
         $set: {
            mediaImage: b64
         }
      })

      resolve({})
   })))

   Promise.all(promises).then((a) => {
      console.log(a)
   })
}

export const createIndexes = async (client: MongoClient) => {
   const dbClient = await getDbClient()
   const db = dbClient.db(ARTINVENTORY_DB)
   const collection = db?.collection<User>(USERS_COLLECTION)

   await collection.createIndex({ "email": 1 }, { unique: true })
}

export const getDataAsCSV = async (user: WithId<User>) => {
   const client = await getDbClient()
   const db = client.db(ARTINVENTORY_DB)
   const artcollection = db?.collection<ArtPiece>(ARTPIECES_COLLECTION)
   const pipeline = [
      { $match: { owner: user._id } },
      {
         $lookup: {
            from: "pictures",
            localField: "pictureId",
            foreignField: "_id",
            as: "pictures",
            pipeline: [
               {
                  $project:
                     { "url": 1 }
               },
            ]
         },
      },
      {
         $lookup: {
            from: "pictures",
            localField: "extraMedia",
            foreignField: "_id",
            as: "otherMedia"
         },
      },
      {
         $lookup: {
            from: "categories",
            localField: "categories",
            foreignField: "_id",
            as: "cats"
         }
      },
      {
         $sort: {
            order: 1
         }
      }
   ]

   const response = artcollection.aggregate(pipeline)

   const data = await response.toArray()

   const fields = ['title', 'dimensions', 'media', 'description', 'creation_date', 'price', 'quantity']

   let s = ''
   data.forEach((item, idx) => {
      s = `${s}${idx}`
      Object.keys(item).map((element, index) => {
         if (fields.includes(element)) {
            s = `${s},${item[element].toString()}`
         }
      })
      item.cats.map((element: Category) => {
         s = `${s},${element.type}:${element.label}`
      })
      s += "\r\n"
   })

   return s
}

// TODO: Adapt getImagesAsZip for Next.js - originally used Express Response stream piping with s3-zip.
// The function needs to be reworked to return a Buffer or ReadableStream instead of piping to an Express Response.
// export const getImagesAsZip = async (user: WithId<User>): Promise<Buffer> => {
//    const region = process.env.AWS_S3_REGION || 'eu-west-1'
//    const folder = `${user._id.toString()}/`
//    const files = await listDirObjects(ARTINVENTORY_BUCKET, folder)
//    // Previously used s3Zip.archive(...).pipe(res) with Express Response
//    // Need to collect the stream into a Buffer for Next.js API routes
//    return Buffer.from('')
// }

export const movePictureToFolder = async (pictureId: string, path: string, owner: WithId<User>) => {
   const picture = await getPictures({ _id: new ObjectId(pictureId), owner: owner._id })

   if (picture) {
      let name = picture[0].url
      const idx = picture[0].url.lastIndexOf('/')
      if (idx !== -1) {
         name = picture[0].url.substring(idx + 1)
      }

      let destination
      if (path !== '/') {
         destination = `${picture[0].owner.toString()}/${path}${name}`
      } else {
         destination = `${picture[0].owner.toString()}/${name}`
      }
      try {
         await copyObject(ARTINVENTORY_BUCKET, `${ARTINVENTORY_BUCKET}/${picture[0].owner.toString()}/${picture[0].url}`, destination)
         let newkey = `${path}${name}`
         if (path === '/') {
            newkey = `${name}`
         }

         await deleteObject(ARTINVENTORY_BUCKET,  `${picture[0].owner.toString()}/${picture[0].url}`)

         await updatePicture({ _id: new ObjectId(pictureId) }, { $set: { url: newkey } })
         return true
      } catch (e) {

      }
   } else {
      return false
   }
}
