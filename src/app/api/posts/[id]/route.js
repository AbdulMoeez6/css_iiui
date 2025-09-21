import { prisma } from '@/lib/prisma';
import { deleteObject } from '@/lib/s3';

export const runtime = 'nodejs';

export async function DELETE(req, { params }) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) return new Response(JSON.stringify({ error: 'Invalid id' }), { status: 400 });

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });

  await deleteObject(post.imageName);
  await prisma.post.delete({ where: { id } });
  return new Response(JSON.stringify({ ok: true }));
}
