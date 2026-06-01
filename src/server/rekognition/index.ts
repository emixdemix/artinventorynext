import sharp from 'sharp'
import {
  RekognitionClient,
  DetectModerationLabelsCommand,
  ModerationLabel,
} from '@aws-sdk/client-rekognition'
import { ARTINVENTORY_BUCKET } from '../interfaces'
import { getObject } from '../s3'

export interface ModerationLabelLite {
  name: string
  parent: string
  confidence: number
}

export interface ModerationFinding {
  pictureId: string
  key: string
  labels: ModerationLabelLite[]
}

export interface ModerationImageReport {
  pictureId: string
  key: string
  labels: ModerationLabelLite[]
  explicit: boolean
  scanned: boolean
}

export interface ModerationReport {
  hasExplicit: boolean
  images: ModerationImageReport[]
}

export const isRekognitionEnabled = (): boolean =>
  process.env.REKOGNITION_ENABLED === 'true'

let client: RekognitionClient | null = null

const getClient = (): RekognitionClient | null => {
  if (!isRekognitionEnabled()) return null
  if (client) return client

  const accessKeyId = process.env.REKOGNITION_AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.REKOGNITION_AWS_SECRET_ACCESS_KEY
  const region = process.env.REKOGNITION_AWS_REGION || 'eu-west-1'

  if (!accessKeyId || !secretAccessKey) {
    console.warn('[rekognition] enabled but credentials missing; skipping')
    return null
  }

  client = new RekognitionClient({
    region,
    credentials: { accessKeyId, secretAccessKey },
  })
  return client
}

const EXPLICIT_PARENTS = new Set([
  'Explicit Nudity',
  'Explicit',
  'Sexual Activity',
])

const isExplicit = (label: ModerationLabel): boolean => {
  const parent = label.ParentName || ''
  const name = label.Name || ''
  if (EXPLICIT_PARENTS.has(parent)) return true
  if (EXPLICIT_PARENTS.has(name)) return true
  return false
}

const MIN_CONFIDENCE = 70
const MAX_DIMENSION = 1600

const prepareImageBytes = async (
  bucket: string,
  key: string,
): Promise<Buffer | null> => {
  try {
    const data = await getObject(bucket, key)
    if (!data.Body) return null
    const buffer = data.Body as Buffer
    return await sharp(buffer)
      .rotate()
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85 })
      .toBuffer()
  } catch (e) {
    console.error('[rekognition] failed to prepare image', {
      key,
      err: (e as Error).message,
    })
    return null
  }
}

export const scanImageLabels = async (
  bucket: string,
  key: string,
): Promise<{ scanned: boolean; labels: ModerationLabel[] }> => {
  const c = getClient()
  if (!c) return { scanned: false, labels: [] }
  const bytes = await prepareImageBytes(bucket, key)
  if (!bytes) return { scanned: false, labels: [] }
  try {
    const res = await c.send(
      new DetectModerationLabelsCommand({
        Image: { Bytes: bytes },
        MinConfidence: MIN_CONFIDENCE,
      }),
    )
    return { scanned: true, labels: res.ModerationLabels || [] }
  } catch (e) {
    console.error('[rekognition] detect failed', { key, err: (e as Error).message })
    return { scanned: false, labels: [] }
  }
}

export const scanKeys = async (
  pictures: { pictureId: string; key: string }[],
): Promise<ModerationReport> => {
  if (!isRekognitionEnabled()) {
    return { hasExplicit: false, images: [] }
  }
  const images: ModerationImageReport[] = []
  let hasExplicit = false
  for (const p of pictures) {
    const { scanned, labels } = await scanImageLabels(ARTINVENTORY_BUCKET, p.key)
    const explicit = labels.some(isExplicit)
    if (explicit) hasExplicit = true
    images.push({
      pictureId: p.pictureId,
      key: p.key,
      scanned,
      explicit,
      labels: labels.map((l) => ({
        name: l.Name || '',
        parent: l.ParentName || '',
        confidence: Math.round(l.Confidence || 0),
      })),
    })
  }
  return { hasExplicit, images }
}
