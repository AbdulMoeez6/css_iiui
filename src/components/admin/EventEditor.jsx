'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import FontFamily from '@tiptap/extension-font-family';

export default function EventEditor({ event = null, onSave }) {
  const [title, setTitle] = useState(event?.title || '');
  const [featuredImage, setFeaturedImage] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit, Image, Link, TextStyle, Color, FontFamily],
    content: event?.description || '',
    immediatelyRender: false,
  });

  if (!isMounted) return <p>Loading editor...</p>;

  const addImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleSave = async () => {
    const description = editor?.getHTML() || '';
    const payload = { title, description, featuredImage };
    await onSave?.(payload);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      {/* Title */}
      <input
        className="w-full p-2 border rounded text-lg font-bold"
        placeholder="Event Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 border-b pb-2">
        <button onClick={() => editor.chain().focus().toggleBold().run()} className="px-2 py-1 border rounded">Bold</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className="px-2 py-1 border rounded">Italic</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="px-2 py-1 border rounded">H2</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className="px-2 py-1 border rounded">H3</button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="px-2 py-1 border rounded">• List</button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="px-2 py-1 border rounded">1. List</button>
        <button onClick={addImage} className="px-2 py-1 border rounded">Add Image</button>
        <button onClick={() => editor.chain().focus().undo().run()} className="px-2 py-1 border rounded">↶ Undo</button>
        <button onClick={() => editor.chain().focus().redo().run()} className="px-2 py-1 border rounded">↷ Redo</button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="border p-2 rounded min-h-[300px]" />

      {/* Featured Image Upload */}
      <div className="flex items-center gap-2">
        <input type="file" accept="image/*" onChange={e => setFeaturedImage(e.target.files[0])} />
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={!!featuredImage}
            onChange={() => setFeaturedImage(null)}
          />
          Featured Image
        </label>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Save Event
      </button>
    </div>
  );
}
