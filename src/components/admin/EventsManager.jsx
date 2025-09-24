'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function EventsManager() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(setEvents);
  }, []);

  return (
    <div className="grid md:grid-cols-3 gap-6 p-4">
      {events.map(ev => (
        <div key={ev.id} className="relative bg-black/20 rounded-lg overflow-hidden shadow-lg flex flex-col transform transition hover:-translate-y-1">
          {ev.priority && <span className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">Priority</span>}
          {ev.images[0] && <img src={ev.images[0].url} alt={ev.title} className="h-48 w-full object-cover" />}
          <div className="p-4 flex-1 flex flex-col">
            <h2 className="font-bold text-lg">{ev.title}</h2>
            <p className="text-sm text-gray-200 mt-1 line-clamp-3">{ev.description}</p>
            <div className="mt-auto pt-2">
              <Link href={`/events/${ev.id}`} className="text-blue-500 hover:underline">Read More</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
