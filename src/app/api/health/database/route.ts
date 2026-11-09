import { prisma } from '@/lib/prisma';

export async function GET() {
  const configured = Boolean(process.env.DATABASE_URL);
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ ok: true, database: 'connected', configured }, {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch {
    return Response.json({ ok: false, database: 'unavailable', configured }, {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
