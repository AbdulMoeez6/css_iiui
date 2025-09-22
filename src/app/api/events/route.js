import prisma from '@/lib/prisma';
import sharp from 'sharp';
import { randomImageName, putObject, signGet } from '@/lib/s3';

export const runtime = 'nodejs';

export async function GET() {
  const events = await prisma.event.findMany({ orderBy: [{ date: 'desc' }], include: { images: true } });
  // attach signed URLs for each event image
  const out = await Promise.all(events.map(async ev => ({
    ...ev,
    images: await Promise.all(ev.images.map(async img => ({ id: img.id, encryptedName: img.encryptedName, priority: img.priority, url: await signGet(img.encryptedName) })))
  })));
  return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json' } });
}

export async function POST(req) {
  const contentType = (req.headers.get('content-type') || '');
  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const title = (form.get('title') || '').toString();
    const description = (form.get('description') || '').toString();
    const date = new Date((form.get('date') || '').toString() || Date.now());

    const event = await prisma.event.create({ data: { title, description, date } });

    const files = form.getAll('images');
    for (let f of files) {
      if (!f) continue;
      const buffer = Buffer.from(await f.arrayBuffer());
      const output = await sharp(buffer).resize({ width: 1600 }).webp().toBuffer();
      const encryptedName = `${randomImageName()}.webp`;
      await putObject(encryptedName, output, 'image/webp');
      await prisma.eventImage.create({ data: { eventId: event.id, encryptedName, priority: 2 } });
    }
    return new Response(JSON.stringify({ ok: true, id: event.id }), { status: 201 });
  } else {
    const body = await req.json();
    const event = await prisma.event.create({ data: { title: body.title || 'Untitled', description: body.description || '', date: body.date ? new Date(body.date) : new Date() } });
    return new Response(JSON.stringify(event), { status: 201 });
  }
}
