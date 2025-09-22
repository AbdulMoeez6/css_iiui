export async function POST(req) {
  const { username, password } = await req.json();
  if (!username || !password) return new Response(JSON.stringify({ error: 'Missing' }), { status: 400 });

  if (username === process.env.ADMIN_NAME && password === process.env.ADMIN_PASS) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: {
        'Set-Cookie': `admin=1; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60 * 24}`,
        'Content-Type': 'application/json'
      }
    });
  }
  return new Response(JSON.stringify({ error: 'Invalid' }), { status: 401 });
}
