import prisma from '@/lib/prisma';

export const revalidate = 0; // always fresh

export default async function EventPage({ params }) {
  const id = Number(params.id);
  const ev = await prisma.event.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!ev) return <div className="p-4">Event not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {ev.images[0] && (
        <img
          src={ev.images[0].url}
          alt={ev.title}
          className="w-full h-96 object-cover rounded-lg mb-4"
        />
      )}
      <h1 className="text-3xl font-bold mb-2">{ev.title}</h1>
      <p className="text-gray-400 text-sm mb-6">{new Date(ev.date).toLocaleDateString()}</p>
      <div
        className="prose prose-invert max-w-full"
        dangerouslySetInnerHTML={{ __html: ev.description }}
      />
    </div>
  );
}
