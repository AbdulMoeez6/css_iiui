export async function POST() {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Set-Cookie': `admin=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`,
      'Content-Type': 'application/json'
    }
  });
}
