import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3, randomImageName } from "@/lib/s3";

export async function POST(req) {
  try {
    const { fileType } = await req.json();

    const imageName = randomImageName();
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: imageName,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

    return Response.json({ uploadUrl, key: imageName });
  } catch (err) {
    console.error("Upload URL error:", err);
    return new Response("Failed to create upload URL", { status: 500 });
  }
}
