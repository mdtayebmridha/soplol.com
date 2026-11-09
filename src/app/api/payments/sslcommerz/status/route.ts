import { isSslcommerzConfigured } from '@/lib/sslcommerz';

export async function GET() {
  return Response.json({ enabled: isSslcommerzConfigured() }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
