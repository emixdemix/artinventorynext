import { ObjectId } from "mongodb";

export const ARTINVENTORY_BUCKET = "artinventory-files";

export interface KeyValue {
  [key: string]: any;
}

export interface RedisData {
  key: string;
  data: any;
  timetolive: number;
}

export interface ErrorCode {
  code: number;
  description: string;
}

export const CategoryTypes = ["category", "status", "arttype"];

export interface Template {
  name: string;
  html: string;
}

export interface Picture {
  url: string;
  dimensions: string;
  extension: string;
  originalName: string;
  b64Image: string;
  mediaImage: string;
  owner: ObjectId;
  name: string;
  media: string;
}

export interface Selection {
  owner: ObjectId;
  artpieces: ObjectId[];
  name: string;
}

export interface Category {
  owner: ObjectId;
  label: string;
  value: string;
  type: string;
}

export interface ArtPiece {
  title: string;
  dimensions: string;
  media: string;
  description: string;
  creation_date: string;
  price: number;
  order: number;
  quantity: number;
  pictureId: ObjectId[];
  extraMedia: ObjectId[];
  categories: ObjectId[];
  owner: ObjectId;
  b64Image: string;
}

export interface Shows {
  owner: ObjectId;
  name: string;
  location: string;
  list: ObjectId;
  begin: string;
  end: string;
  website: string;
  description: string;
}

export interface Reports {
  name: string;
  image: string;
}

export interface Feedback {
  owner: ObjectId;
  option: string;
  description: string;
  createdAt: number;
}

export interface UserProfile {
  name: string;
  picture: string;
  describe: string;
  url: string;
  website: string;
  statement: string;
  signature: string;
  front: string;
  back: string;
  fronturl: string;
  backurl: string;
  measures: string;
  valuta: string;
}

export interface Logins {
  userId: ObjectId;
  createdAt: number;
}

export interface User {
  name: string;
  email: string;
  password: string;
  profile: UserProfile;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
}

export interface Sales {
  _id: ObjectId;
  createdAt: number;
  quantity: string;
}

export interface Customer {
  owner: ObjectId;
  name: string;
  contactName: string;
  contactEmail: string;
  contactNumber: string;
  location: Address;
  description: string;
  artpieces: Sales[];
}

export type LANGUAGES_SUPPORTED = "en-us" | "it-is";

export type Translations = {
  [key in LANGUAGES_SUPPORTED]: KeyValue;
};
