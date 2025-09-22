'use client';
import { useEffect, useState } from 'react';

export default function PostsManager() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  const addPost = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) formData.append('image', image);

    const res = await fetch('/api/posts', {
      method: 'POST',
      body: formData
    });

    const newPost = await res.json();
    setPosts([...posts, newPost]);
    setTitle('');
    setContent('');
    setImage(null);
  };

  const deletePost = async (id) => {
    await fetch(`/api/posts/${id}`, { method: 'DELETE' });
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div className="p-4 border rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-2">📝 Manage Posts</h2>

      <div className="flex flex-col gap-2 mb-4">
        <input
          className="border p-2 rounded"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Post Title"
        />
        <input
          className="border p-2 rounded"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Post Content"
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
        />
        <button onClick={addPost} className="bg-green-500 text-white px-4 py-2 rounded">
          Add Post
        </button>
      </div>

      <ul>
        {posts.map(p => (
          <li key={p.id} className="flex justify-between items-center mb-2 border p-2 rounded">
            <div>
              <p className="font-semibold">{p.title}</p>
              <p className="text-sm text-gray-600">{p.content}</p>
              {p.imageUrl && (
                <img src={p.imageUrl} alt={p.title} className="w-32 h-20 object-cover mt-2 rounded" />
              )}
            </div>
            <button onClick={() => deletePost(p.id)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
