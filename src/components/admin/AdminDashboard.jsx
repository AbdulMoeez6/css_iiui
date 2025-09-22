'use client';
import { useState } from 'react';
import EventsManager from './EventsManager';
import PostsManager from './PostsManager';
// import TeamManager, TimelineManager, GalleryManager when ready

export default function AdminDashboard(){
  const [tab,setTab]=useState('Events');
  const tabs = ['Events','Posts','Team','Timeline','Gallery'];
  return (
    <div className="section py-12">
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-title">Dashboard</h1>
        <form action="/api/auth/logout" method="post">
          <button className="btn-ghost" type="submit">Sign out</button>
        </form>
      </div>

      <div className="flex gap-3 border-b border-white/10 pb-3 mb-6">
        {tabs.map(t=> <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded ${tab===t? 'bg-white text-black font-bold':'text-white/70'}`}>{t}</button> )}
      </div>

      <div>
        {tab === 'Events' && <EventsManager/>}
        {tab === 'Posts' && <PostsManager/>}
        {/* Add TeamManager, TimelineManager, GalleryManager similarly */}
      </div>
    </div>
  );
}
