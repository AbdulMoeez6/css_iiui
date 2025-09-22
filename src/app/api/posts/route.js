// server-side
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, slug, category = 'OTHER', descriptionHtml, imageKey, tags = [] } = body;

    if (!title || !slug || !descriptionHtml || !imageKey) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    // Save post: descriptionHtml stored as text (HTML)
    const post = await prisma.post.create({
      data: {
        title,
        slug,
        category,
        description: descriptionHtml, // HTML
        image: imageKey,
        // Optionally store tags in a JSON/text column or a separate table — here we save as JSON string in descriptionMeta if needed
      },
    });

    console.log('[DEBUG] created post id=', post.id);
    return new Response(JSON.stringify(post), { status: 201 });
  } catch (err) {
    console.error('[DEBUG] POST /api/posts error', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
