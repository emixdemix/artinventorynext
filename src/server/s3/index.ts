import {
  S3Client,
  CreateBucketCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  GetObjectCommand,
  GetObjectCommandOutput,
  PutObjectCommand,
  DeleteObjectCommand,
  CopyObjectCommand,
  CopyObjectCommandOutput,
} from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region: process.env.AWS_S3_REGION || 'eu-west-1',
  followRegionRedirects: true,
})

export function createBucket(bucketName: string) {
  return s3.send(new CreateBucketCommand({ Bucket: bucketName }))
}

export function listBucketObjects(bucketName: string): Promise<ListObjectsV2CommandOutput> {
  return s3.send(new ListObjectsV2Command({ Bucket: bucketName }))
}

export function listDirObjects(
  bucketName: string,
  prefix: string,
  delimiter: string = '',
): Promise<ListObjectsV2CommandOutput> {
  return s3.send(new ListObjectsV2Command({
    Bucket: bucketName,
    Prefix: prefix,
    Delimiter: delimiter,
  }))
}

export function copyObjects(bucketName: string, file: string, newKey: string) {
  return s3.send(new CopyObjectCommand({
    Bucket: bucketName,
    CopySource: '/' + bucketName + '/' + file,
    Key: newKey,
  }))
}

// v3 returns Body as a Readable stream. Buffer it so callers can keep using
// (data.Body as Buffer) the way they did with v2.
export async function getObject(
  bucketName: string,
  key: string,
): Promise<Omit<GetObjectCommandOutput, 'Body'> & { Body: Buffer }> {
  const result = await s3.send(new GetObjectCommand({ Bucket: bucketName, Key: key }))
  const stream: any = result.Body
  const chunks: Buffer[] = []
  if (stream && typeof stream[Symbol.asyncIterator] === 'function') {
    for await (const chunk of stream as AsyncIterable<Uint8Array>) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }
  } else if (stream && typeof stream.transformToByteArray === 'function') {
    const arr: Uint8Array = await stream.transformToByteArray()
    chunks.push(Buffer.from(arr))
  }
  const Body = Buffer.concat(chunks)
  return { ...result, Body }
}

export function deleteObject(bucketName: string, key: string) {
  return s3.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }))
}

export function removeS3Folder(bucketName: string, key: string) {
  return new Promise((resolve) => {
    deleteObject(bucketName, key).then(() => resolve(true))
  })
}

export function createS3Folder(bucketName: string, key: string) {
  return new Promise((resolve, reject) => {
    if (key && key.length > 1 && key.endsWith('/')) {
      resolve(putObject(bucketName, key, Buffer.from('')))
    } else {
      reject({})
    }
  })
}

export function putObject(bucketName: string, key: string, content: Blob | Buffer) {
  return s3.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: content as any,
  }))
}

export function copyObject(
  bucketName: string,
  sourceKey: string,
  destinationKey: string,
): Promise<CopyObjectCommandOutput> {
  return s3.send(new CopyObjectCommand({
    CopySource: sourceKey,
    Bucket: bucketName,
    Key: destinationKey,
  }))
}
