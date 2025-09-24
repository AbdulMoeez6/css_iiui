"use client";

import dynamic from "next/dynamic";

// ✅ Import without SSR
const EventEditor = dynamic(() => import("@/components/admin/EventEditor"), {
  ssr: false,
});

export default function NewEventPage() {
  const handleSave = async (payload) => {
    console.log("Saving event:", payload);
    // TODO: connect with your backend or EventsManager
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Create New Event</h1>
      <EventEditor onSave={handleSave} />
    </div>
  );
}
