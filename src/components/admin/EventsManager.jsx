'use client';
import { useState, useEffect } from 'react';
import EventFormModal from './EventFormModal';

export default function EventsManager() {
  const [events, setEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetch('/api/events')
      .then(res => res.json())
      .then(data => {
        console.log('[DEBUG] Events fetched:', data);
        setEvents(data);
      });
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Events</h2>
        <button
          onClick={() => { setSelected(null); setOpen(true); }}
          className="px-3 py-1 bg-blue-600 text-white rounded"
        >
          + Add Event
        </button>
      </div>

      <ul className="space-y-3">
        {events.map(e => (
          <li key={e.id} className="p-3 border rounded flex justify-between">
            <div>
              <h3 className="font-semibold">{e.title}</h3>
              <p className="text-sm text-gray-500">{e.date}</p>
              {e.imageUrl && (
                <img
                  src={e.imageUrl}
                  alt="event"
                  className="w-32 h-20 object-cover mt-2 rounded"
                  onError={() => console.log('[DEBUG] Failed to load image:', e.imageUrl)}
                />
              )}
              <p className="text-sm">{e.description}</p>
              {e.priority && <span className="text-red-500 text-xs">Priority Image ✅</span>}
            </div>
            <div className="space-x-2">
              <button
                onClick={() => { setSelected(e); setOpen(true); }}
                className="px-2 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(e.id)}
                className="px-2 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {open && (
        <EventFormModal
          onClose={() => setOpen(false)}
          event={selected}
          refresh={() => {
            fetch('/api/events')
              .then(res => res.json())
              .then(data => {
                console.log('[DEBUG] Events refreshed:', data);
                setEvents(data);
              });
          }}
        />
      )}
    </div>
  );
}
