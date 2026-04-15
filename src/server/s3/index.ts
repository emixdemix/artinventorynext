import AWS from 'aws-sdk'


/*  Managed automatically by the SDK
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY
*/

/************************** S3 functionality *****************************/
AWS.config.update({region: process.env.AWS_S3_REGION || 'eu-west-1'});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});

export function createBucket(bucketName:string) {
  const params = {Bucket: bucketName}
  return new Promise((resolve, reject) => {
    s3.createBucket(params, function (err, data) {
      if (!err) {
        resolve(data)
      } else {
        reject(err);
      }
    })
  })
}

export function listBucketObjects(bucketName:string) {
  const params = {
    Bucket: bucketName
   };
  return new Promise((resolve, reject) => {
    s3.listObjectsV2(params,
      function (err, data) {
        if (!err) {
          resolve(data)
        } else {
          reject(err);
        }
    })
  })
}

export function listDirObjects(bucketName:string, prefix:string, delimiter:string = ''):Promise<AWS.S3.ListObjectsV2Output> {
  const params = {
    Bucket: bucketName,
    Prefix: prefix,
    Delimiter: delimiter
   };
  return new Promise((resolve, reject) => {
    s3.listObjectsV2(params,
      function (err, data) {
        if (!err) {
          resolve(data)
        } else {
          reject(err);
        }
    })
  })
}

export function copyObjects(bucketName:string, file:string, newKey:string) {
  const params = {
    Bucket: bucketName, 
    CopySource: '/'+bucketName+'/'+file, 
    Key: newKey
   };
  return new Promise((resolve, reject) => {
    s3.copyObject(params,
      function (err, data) {
        if (!err) {
          resolve(data)
        } else {
          reject(err);
        }
    })
  })
}

export function getObject(bucketName:string, key:string):Promise<AWS.S3.GetObjectOutput>{
  const params = {
    Bucket: bucketName,
    Key: key
   };
  return new Promise((resolve, reject) => {
    s3.getObject(params,
      function (err, data) {
        if (!err) {
          resolve(data)
        } else {
          reject(err);
        }
    })
  })
}

export function deleteObject(bucketName:string, key:string) {
  const params = {
    Bucket: bucketName,
    Key: key
   };
  return new Promise((resolve, reject) => {
    s3.deleteObject(params,
      function (err, data) {
        if (!err) {
          resolve(data)
        } else {
          reject(err);
        }
    })
  })
}

export function removeS3Folder(bucketName:string, key:string) {
  return new Promise((resolve, reject) => {
    deleteObject(bucketName, key).then(res => {
      resolve(true)
    })
  })
}

export function createS3Folder(bucketName:string, key:string) {
   return new Promise((resolve, reject) => {
     if (key && key.length>1 && key.endsWith('/')) {
      resolve(putObject(bucketName, key, Buffer.from('')))
     } else {
      reject({})
     }
   })
 }


export function putObject(bucketName:string, key:string, content:Blob | Buffer) : Promise<any> {
  const params = {
    Body: content,
    Bucket: bucketName,
    Key: key
   };
  return new Promise((resolve, reject) => {
    s3.putObject(params,
      function (err, data) {
        if (!err) {
          resolve(data)
        } else {
          reject(err);
        }
    })
  })
}


export function copyObject(bucketName:string, sourceKey:string, destinationKey:string) : Promise<AWS.S3.CopyObjectOutput> {
   const params = {
     CopySource: sourceKey,
     Bucket: bucketName,
     Key: destinationKey
    };
   return new Promise((resolve, reject) => {
     s3.copyObject(params,
       function (err, data) {
         if (!err) {
           resolve(data)
         } else {
           reject(err);
         }
     })
   })
 }
 