'use client';
import EventsManager from '@/components/admin/EventsManager';
import Link from 'next/link';

export default function AdminPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <Link href="/admin/new" className="inline-block mb-4 px-4 py-2 bg-blue-600 text-white rounded">
        + Add New Event
      </Link>
      <EventsManager />
    </div>
  );
}
