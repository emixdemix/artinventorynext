import { AxiosResponse } from "axios"

export const CategoryTypes = ['category', 'status', 'arttype']

export interface KeyValue {
   [key: string]: any
}

export interface OptionType {
   label: string
   value: string
}

export interface ArtPieceDAO {
   title: string
   dimensions: string
   description: string
   quantity: string
   price: number
   image: File | string,
   year: string,
   categories: string[]
   media: string
}

export interface Reports {
   name: string
   image: string
 }

 export interface Profile {
   name: string
   picture: string
   describe: string
   url: string
   website: string
   statement: string
   signature: string
   front: string
   back: string
   fronturl: string 
   backurl: string
   measures: string
   valuta: string
}

export interface StoreContext {
   profile?: Profile
   artPieces?: ArtPiece[]
}

export interface Category {
      _id: string
      label: string
      value: string
      type: string
}

export interface Picture {
   _id: string
   url: string
   name: string
   extension: string
   dimensions: string
   owner: string
   b64Image: string
   mediaImage: string
}

export interface MediaData  { 
   url: string, 
   id:string, 
   img: string,
   name: string
}

export interface PictureDao {
   "_id": string
   "url": string
   "extension": string
   "dimensions": string
   "b64Image": string
   "mediaImage": string
   "name": string
   details: ArtPiece[]
}

export interface ArtSelection {
   _id?: string
   name: string
   artpieces: ArtPiece[]
}

export interface Shows {
   _id?: string
   owner: string
   name: string
   location: string
   list: string
   begin: string
   end: string
   website: string
   description: string
}

export interface Address {
   street: string
   city: string 
   state: string 
   country: string
}
export interface Sales {
   _id: string 
   createdAt: number,
   quantity: string
}

export interface Customer {
   _id?: string
   owner: string
   name: string
   contactName: string
   contactEmail: string
   contactNumber: string
   location: Address
   description: string
   artpieces: Sales[]
}

export interface ArtPiece {
   _id: string
   title: string
   dimensions: string
   media: string
   description: string
   creation_date: string
   status: string
   type: string
   price: number
   order: number
   quantity: number
   pictureId: string[]
   categories: string[]
   extraMedia: string[]
   otherMedia?: Picture[]
   cats: Category[]
   pictures: KeyValue,
   b64Image: string
}

export interface Timeout {
   start: number
   visible: boolean
}

export interface GeneralAPIError {
   error: boolean
   response: AxiosResponse | KeyValue
}

export interface Feedback {
   owner: string
   option: string
   description: string
   createdAt: number
}
