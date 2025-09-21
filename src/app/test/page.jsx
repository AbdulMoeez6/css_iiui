'use client';
import { useState, useEffect } from 'react';

export default function Page() {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState('');

  const fetchPosts = async () => {
    const res = await fetch('/api/posts', { cache: 'no-store' });
    setPosts(await res.json());
  };

  useEffect(() => { fetchPosts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return setMessage('Select an image');
    const form = new FormData();
    form.append('caption', caption);
    form.append('image', image);
    const res = await fetch('/api/posts', { method: 'POST', body: form });
    if (res.ok) {
      setCaption('');
      setImage(null);
      setMessage('Uploaded!');
      fetchPosts();
    } else setMessage('Upload failed');
  };

  const handleDelete = async (id) => {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    setPosts(posts.filter((p) => p.id !== id));
  };

  return (
    <main className="p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
        <input value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Caption" className="border p-2"/>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="border p-2"/>
        <button className="bg-blue-500 text-white p-2 rounded">Upload</button>
      </form>
      <p>{message}</p>
      <div className="grid grid-cols-2 gap-4">
        {posts.map((p) => (
          <div key={p.id} className="border rounded overflow-hidden">
            <img src={p.imageUrl} alt={p.caption} className="w-full h-64 object-cover"/>
            <div className="flex justify-between p-2">
              <span>{p.caption}</span>
              <button onClick={() => handleDelete(p.id)} className="text-red-600 text-xs">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}




