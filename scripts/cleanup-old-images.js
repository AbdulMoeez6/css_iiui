import prisma from '../src/lib/prisma';
import { deleteObject } from '../src/lib/s3';

const DAYS = 21; // keep priority=2 images for 21 days
async function run(){
  const cutoff = new Date(Date.now() - DAYS * 24*60*60*1000);
  const old = await prisma.eventImage.findMany({ where: { priority: 2, createdAt: { lt: cutoff } } });
  for (const img of old){
    try { await deleteObject(img.encryptedName); } catch(e){ console.warn('s3 delete fail', e.message); }
    await prisma.eventImage.delete({ where: { id: img.id } });
  }
  console.log('done, removed', old.length);
  process.exit(0);
}
run().catch(e=>{ console.error(e); process.exit(1); });
