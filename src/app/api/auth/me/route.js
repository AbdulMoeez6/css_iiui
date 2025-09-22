export async function GET(req) {
  const cookie = req.headers.get('cookie') || '';
  const admin = cookie.split(';').map(s => s.trim()).includes('admin=1');
  return new Response(JSON.stringify({ admin }), { headers: { 'Content-Type': 'application/json' } });
}
