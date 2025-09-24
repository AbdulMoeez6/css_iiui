import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3, randomImageName } from '@/lib/s3';

export async function POST(req) {
  const { fileType } = await req.json();
  const key = randomImageName() + '.' + (fileType.split('/')[1] || 'jpg');

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    ContentType: fileType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  return new Response(JSON.stringify({ uploadUrl, key }), { status: 200 });
}
