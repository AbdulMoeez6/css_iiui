import sharp from 'sharp';
import { prisma } from '@/lib/prisma';
import { randomImageName, putObject, signGet } from '@/lib/s3';

export const runtime = 'nodejs';

export async function GET() {
  const posts = await prisma.post.findMany({ orderBy: [{ createdAt: 'desc' }] });
  const withUrls = await Promise.all(
    posts.map(async (p) => ({ ...p, imageUrl: await signGet(p.imageName) }))
  );
  return new Response(JSON.stringify(withUrls), { headers: { 'Content-Type': 'application/json' } });
}

export async function POST(req) {
  try {
    const form = await req.formData();
    const caption = (form.get('caption') || '').trim();
    const file = form.get('image');
    if (!file) return new Response(JSON.stringify({ error: 'Image required' }), { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const output = await sharp(buffer).resize({ width: 1080, height: 1920, fit: 'contain' }).webp().toBuffer();

    const imageName = randomImageName() + '.webp';
    await putObject(imageName, output, 'image/webp');

    const post = await prisma.post.create({ data: { caption, imageName } });
    return new Response(JSON.stringify(post), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
