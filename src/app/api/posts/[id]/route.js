import prisma from '@/lib/prisma';
import { deleteObject } from '@/lib/s3';

export const runtime = 'nodejs';

export async function GET(req, { params }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return new Response(JSON.stringify({ error: 'Invalid id' }), { status: 400 });
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
  return new Response(JSON.stringify(post));
}

export async function PUT(req, { params }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return new Response(JSON.stringify({ error: 'Invalid id' }), { status: 400 });

    const body = await req.json();
    const { title, slug, category = 'OTHER', descriptionHtml, imageKey } = body;
    if (!title || !slug || !descriptionHtml || !imageKey)
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });

    const updated = await prisma.post.update({
      where: { id },
      data: { title, slug, category, description: descriptionHtml, image: imageKey },
    });

    console.log('[DEBUG] updated post', id);
    return new Response(JSON.stringify(updated));
  } catch (err) {
    console.error('[DEBUG] PUT /api/posts/[id] error', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) return new Response(JSON.stringify({ error: 'Invalid id' }), { status: 400 });

    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

    // delete S3 object, ignore S3 errors but log
    try { await deleteObject(post.image); } catch (err) { console.warn('[DEBUG] S3 delete failed', err.message); }

    await prisma.post.delete({ where: { id } });
    console.log('[DEBUG] deleted post', id);
    return new Response(JSON.stringify({ ok: true }));
  } catch (err) {
    console.error('[DEBUG] DELETE /api/posts/[id] error', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
