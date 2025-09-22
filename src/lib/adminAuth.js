export function isAdminFromReq(req) {
  const cookie = req.headers.get('cookie') || '';
  return cookie.split(';').map(s => s.trim()).includes('admin=1');
}
