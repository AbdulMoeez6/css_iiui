'use client';
import { useState, useEffect } from 'react';
import EventEditor from '@/components/admin/EventEditor';
import { useRouter } from 'next/navigation';

export default function NewEventPage({ params }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [priority, setPriority] = useState(false);
  const [image, setImage] = useState(null);
  const router = useRouter();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSave = async (content) => {
    let imageUrl = '';
    if (image) {
      // Upload to S3
      const res = await fetch('/api/upload-url', {
        method: 'POST',
        body: JSON.stringify({ fileType: image.type }),
      });
      const { uploadUrl, key } = await res.json();
      await fetch(uploadUrl, { method: 'PUT', body: image, headers: { 'Content-Type': image.type } });
      imageUrl = key; // save encryptedName
    }

    await fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify({ title, description: content, date, imageUrl, priority }),
      headers: { 'Content-Type': 'application/json' },
    });

    router.push('/admin/events'); // go back to event grid
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">New Event</h1>

      <input
        type="text"
        placeholder="Event Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        className="border p-2 rounded mb-4"
      />

      <label className="flex items-center space-x-2 mb-4">
        <input type="checkbox" checked={priority} onChange={e => setPriority(e.target.checked)} />
        <span>Priority Image</span>
      </label>

      <input type="file" accept="image/*" onChange={handleImageChange} className="mb-4" />

      <EventEditor onSave={handleSave} />
    </div>
  );
}
