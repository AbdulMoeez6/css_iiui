'use client';
import { useState } from 'react';
import EventEditor from '@/components/admin/EventEditor';
import EventsManager from '@/components/EventsManager';

export default function AdminEvents() {
  const [editing, setEditing] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-6">
      <button
        onClick={() => setEditing({})}
        className="mb-4 px-3 py-1 bg-green-600 text-white rounded"
      >
        + Add Event
      </button>

      {editing ? (
        <EventEditor
          event={editing}
          onSaved={() => { setEditing(null); setRefreshKey(k => k + 1); }}
        />
      ) : (
        <EventsManager key={refreshKey} />
      )}
    </div>
  );
}
