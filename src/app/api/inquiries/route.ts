import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

const contactInquiry = z.object({
  type: z.literal('CONTACT'),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().min(2).max(120),
  details: z.object({ message: z.string().trim().min(5).max(5000) }),
});

const sellerInquiry = z.object({
  type: z.literal('SELLER_APPLICATION'),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(30),
  subject: z.string().trim().max(120).optional(),
  details: z.object({
    storeName: z.string().trim().min(2).max(120),
    category: z.enum(['fashion', 'gifts', 'home', 'office', 'jewelry']),
    portfolioUrl: z.union([z.string().url().max(500), z.literal('')]).optional(),
    description: z.string().trim().max(3000).optional(),
  }),
});

const corporateInquiry = z.object({
  type: z.literal('CORPORATE_GIFTING'),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(30),
  subject: z.string().trim().max(120).optional(),
  details: z.object({
    companyName: z.string().trim().min(2).max(160),
    quantity: z.string().trim().min(1).max(40),
    occasion: z.string().trim().min(2).max(100),
    message: z.string().trim().max(3000).optional(),
  }),
});

const inquirySchema = z.union([contactInquiry, sellerInquiry, corporateInquiry]);

type RateBucket = { count: number; resetAt: number };
const globalForInquiryLimit = globalThis as typeof globalThis & {
  inquirySubmissionLimits?: Map<string, RateBucket>;
};
const submissionLimits = globalForInquiryLimit.inquirySubmissionLimits ?? new Map<string, RateBucket>();
globalForInquiryLimit.inquirySubmissionLimits = submissionLimits;

function isRateLimited(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
  const now = Date.now();
  if (submissionLimits.size > 5_000) {
    for (const [key, entry] of submissionLimits) {
      if (entry.resetAt <= now) submissionLimits.delete(key);
      else if (submissionLimits.size > 4_000) submissionLimits.delete(key);
      if (submissionLimits.size <= 4_000) break;
    }
  }
  const bucket = submissionLimits.get(ip);
  if (!bucket || bucket.resetAt <= now) {
    submissionLimits.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > 10;
}

export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return Response.json({ error: 'Too many submissions. Please try again shortly.' }, { status: 429 });
  }

  let inquiry: z.infer<typeof inquirySchema>;
  try {
    inquiry = inquirySchema.parse(await request.json());
  } catch {
    return Response.json({ error: 'Please check the information in the form.' }, { status: 400 });
  }

  try {
    const saved = await prisma.inquiry.create({
      data: {
        type: inquiry.type,
        name: inquiry.name,
        email: inquiry.email,
        phone: inquiry.phone || null,
        subject: inquiry.subject || null,
        details: inquiry.details as Prisma.InputJsonObject,
      },
      select: { id: true, createdAt: true },
    });

    return Response.json({ reference: saved.id, receivedAt: saved.createdAt.toISOString() }, { status: 201 });
  } catch {
    console.error('Inquiry submission failed.');
    return Response.json({ error: 'The form could not be saved. Please try again.' }, { status: 500 });
  }
}
