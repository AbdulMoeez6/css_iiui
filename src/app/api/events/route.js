import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

// GET: return events and images, attach public file URLs
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'desc' },
      include: { images: true },
    });

    // map images to include fileUrl (public)
    const out = events.map(ev => ({
      ...ev,
      images: ev.images.map(img => ({
        id: img.id,
        encryptedName: img.encryptedName,
        priority: img.priority,
        fileUrl: `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${img.encryptedName}`
      }))
    }));
    return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('GET /api/events error', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

// POST: expects JSON: { title, description, date, images: [{ key, priority }] }
export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description = '', date = new Date().toISOString(), images = [] } = body;

    if (!title) return new Response(JSON.stringify({ error: 'title required' }), { status: 400 });

    const ev = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        images: {
          create: images.map(img => ({
            encryptedName: img.key,
            priority: typeof img.priority === 'number' ? img.priority : 2
          }))
        }
      },
      include: { images: true }
    });

    console.log('[DEBUG] created event id=', ev.id);
    return new Response(JSON.stringify(ev), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('POST /api/events error', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
