"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function NewEventPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [priority, setPriority] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    let imageUrl = null;
    if (image) {
      const res = await fetch("/api/upload-url", {
        method: "POST",
        body: JSON.stringify({ fileType: image.type }),
      });
      const { uploadUrl, key } = await res.json();
      await fetch(uploadUrl, {
        method: "PUT",
        body: image,
        headers: { "Content-Type": image.type },
      });
      imageUrl = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET}.s3.amazonaws.com/${key}`;
    }

    const saveRes = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, imageUrl, priority }),
    });

    if (saveRes.ok) {
      console.log("✅ Event saved");
    } else {
      console.error("❌ Failed to save event");
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Event</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border p-2 rounded"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <ReactQuill value={content} onChange={setContent} />

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={priority}
            onChange={(e) => setPriority(e.target.checked)}
          />
          Priority Image
        </label>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Event
        </button>
      </form>
    </div>
  );
}
