'use client';
import { useState, useEffect } from 'react';
import AdminDashboard from '@/components/admin/AdminDashboard';

export default function AdminPage() {
  const [authed, setAuthed] = useState(null);
  useEffect(()=>{ (async()=>{
    const r = await fetch('/api/auth/me'); const j = await r.json(); setAuthed(j.admin);
  })(); }, []);

  if (authed === null) return <div className="section">Checking auth...</div>;
  if (!authed) return <AuthForm onSuccess={()=>setAuthed(true)} />;
  return <AdminDashboard />;
}

function AuthForm({ onSuccess }) {
  const [user,setUser]=useState(''); const [pass,setPass]=useState(''); const [err,setErr]=useState('');
  async function submit(e){
    e.preventDefault();
    const r = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ username: user, password: pass }) });
    if (r.ok) onSuccess(); else { const j = await r.json(); setErr(j.error||'Login failed'); }
  }
  return (
    <div className="section py-16 max-w-md mx-auto">
      <div className="card p-6">
        <h2 className="section-title">Admin Login</h2>
        {err && <div className="text-red-400">{err}</div>}
        <form onSubmit={submit} className="flex flex-col gap-3">
          <input value={user} onChange={e=>setUser(e.target.value)} placeholder="username" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="password" className="px-3 py-2 rounded bg-black/40 border border-white/10" />
          <div className="flex gap-2"><button className="btn" type="submit">Sign in</button></div>
        </form>
      </div>
    </div>
  );
}
