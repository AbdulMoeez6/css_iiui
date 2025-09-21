import crypto from 'crypto';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

export const s3 = new S3Client({
  region: process.env.BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
  }
});

export const signGet = (Key) =>
  getSignedUrl(s3, new GetObjectCommand({ Bucket: process.env.BUCKET_NAME, Key }), { expiresIn: 3600 });

export const putObject = (Key, Body, ContentType) =>
  s3.send(new PutObjectCommand({ Bucket: process.env.BUCKET_NAME, Key, Body, ContentType }));

export const deleteObject = (Key) =>
  s3.send(new DeleteObjectCommand({ Bucket: process.env.BUCKET_NAME, Key }));
