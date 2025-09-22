import prisma from "@/lib/prisma";

export const runtime = "nodejs"; // keep Node runtime for Prisma

// GET all events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { createdAt: "desc" },
    });
    return Response.json(events);
  } catch (err) {
    console.error("❌ GET /api/events failed:", err);
    return new Response("Failed to fetch events", { status: 500 });
  }
}

// POST new event
export async function POST(req) {
  try {
    const { title, content, imageUrl, priority } = await req.json();

    const newEvent = await prisma.event.create({
      data: { title, content, imageUrl, priority },
    });

    return Response.json(newEvent);
  } catch (err) {
    console.error("❌ POST /api/events failed:", err);
    return new Response("Failed to create event", { status: 500 });
  }
}
