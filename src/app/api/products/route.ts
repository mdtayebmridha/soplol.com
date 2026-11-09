import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { variants: { orderBy: { createdAt: 'asc' } } },
      orderBy: [{ createdAt: 'asc' }, { title: 'asc' }],
    });

    const response = products.map((product) => ({
      id: product.id,
      title: product.title,
      slug: product.slug,
      description: product.description,
      shortDescription: product.shortDescription ?? '',
      category: product.category.toLowerCase(),
      subcategory: product.subcategory?.toLowerCase() ?? 'accessories',
      priceBDT: Number(product.priceBDT),
      priceUSD: Number(product.priceUSD),
      compareAtPriceBDT: product.compareAtPriceBDT === null ? undefined : Number(product.compareAtPriceBDT),
      compareAtPriceUSD: product.compareAtPriceUSD === null ? undefined : Number(product.compareAtPriceUSD),
      images: product.images,
      inStock: product.inStock && product.stockQuantity > 0,
      stockQuantity: product.stockQuantity,
      rating: Number(product.rating),
      reviewCount: product.reviewCount,
      variants: product.variants.map((variant) => ({ name: variant.name, options: variant.options })),
      tags: product.tags,
      isFeatured: product.isFeatured,
      isTrending: product.isTrending,
      isNewArrival: product.isNewArrival,
      vendorId: product.vendorId ?? undefined,
      vendorName: product.vendorName,
    }));

    return Response.json(response, {
      headers: { 'Cache-Control': 'no-store, max-age=0' },
    });
  } catch {
    console.error('Catalog query failed.');
    return Response.json({ error: 'The product catalog is temporarily unavailable.' }, { status: 503 });
  }
}
