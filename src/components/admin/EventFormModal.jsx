'use client';
import { useState } from 'react';

export default function EventFormModal({ onClose, event, refresh }) {
  const [title, setTitle] = useState(event?.title || '');
  const [date, setDate] = useState(event?.date || '');
  const [description, setDescription] = useState(event?.description || '');
  const [priority, setPriority] = useState(event?.priority || false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(event?.imageUrl || '');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      console.log('[DEBUG] Local preview URL:', url);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = event?.imageUrl || '';

    if (image) {
      console.log('[DEBUG] Uploading image:', image.name);
      const presign = await fetch('/api/upload-url', {
        method: 'POST',
        body: JSON.stringify({ name: image.name, type: image.type }),
      });
      const { uploadUrl, fileUrl } = await presign.json();

      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': image.type },
        body: image,
      });

      console.log('[DEBUG] Uploaded to S3:', fileUrl);
      imageUrl = fileUrl;
    }

    const payload = { title, date, description, priority, imageUrl };
    const method = event ? 'PUT' : 'POST';
    const url = event ? `/api/events/${event.id}` : '/api/events';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded w-full max-w-lg space-y-3"
      >
        <h2 className="text-lg font-bold">{event ? 'Edit Event' : 'Add Event'}</h2>
        <input
          type="text"
          placeholder="Title"
          className="w-full border p-2 rounded"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <input
          type="date"
          className="w-full border p-2 rounded"
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={priority}
            onChange={e => setPriority(e.target.checked)}
          />
          <span>Priority Image</span>
        </label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {preview && (
          <img
            src={preview}
            alt="preview"
            className="w-32 h-20 object-cover rounded mt-2"
            onError={() => console.log('[DEBUG] Preview image load failed:', preview)}
          />
        )}
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-3 py-1 border rounded">
            Cancel
          </button>
          <button type="submit" className="px-3 py-1 bg-green-600 text-white rounded">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
    