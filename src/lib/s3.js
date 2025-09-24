import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

export const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export function randomImageName(bytes = 32) {
  return crypto.randomBytes(bytes).toString("hex");
}

export async function putObject({ key, body, contentType }) {
  return await s3.send(new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    Body: body,
    ContentType: contentType,
  }));
}

export async function deleteObject(key) {
  return await s3.send(new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
  }));
}

export function signGet(key) {
  return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}
